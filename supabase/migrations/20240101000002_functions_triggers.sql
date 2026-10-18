-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'driver')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to notify on document expiry (for J-30 and J-7 alerts)
CREATE OR REPLACE FUNCTION check_document_expiry()
RETURNS void AS $$
DECLARE
  doc RECORD;
BEGIN
  FOR doc IN
    SELECT d.*, 
           CASE 
             WHEN entity_type = 'driver' THEN (SELECT full_name FROM profiles WHERE id = d.entity_id)
             WHEN entity_type = 'vehicle' THEN (SELECT registration_number FROM vehicles WHERE id = d.entity_id)
             WHEN entity_type = 'forklift' THEN (SELECT serial_number FROM forklifts WHERE id = d.entity_id)
           END as entity_name
    FROM documents d
    WHERE d.expiry_date IS NOT NULL
      AND d.status = 'active'
      AND (d.expiry_date - CURRENT_DATE = 30 OR d.expiry_date - CURRENT_DATE = 7 OR d.expiry_date <= CURRENT_DATE)
  LOOP
    -- Notify relevant admins/logistic managers
    INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    SELECT p.id, 
           'Document Expiry Alert',
           CASE 
             WHEN doc.expiry_date <= CURRENT_DATE THEN 
               format('Document %s for %s has expired (expired on %s)', doc.document_type, doc.entity_name, doc.expiry_date)
             ELSE 
               format('Document %s for %s expires in %s days (on %s)', doc.document_type, doc.entity_name, (doc.expiry_date - CURRENT_DATE), doc.expiry_date)
           END,
           CASE WHEN doc.expiry_date <= CURRENT_DATE THEN 'alert' ELSE 'warning' END,
           'document',
           doc.id
    FROM profiles p
    WHERE p.role IN ('admin', 'logistic_manager');
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify on maintenance due
CREATE OR REPLACE FUNCTION check_maintenance_due()
RETURNS void AS $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT f.id, f.serial_number, f.next_maintenance_date
    FROM forklifts f
    WHERE f.next_maintenance_date IS NOT NULL
      AND f.status = 'available'
      AND (f.next_maintenance_date - CURRENT_DATE = 30 OR f.next_maintenance_date - CURRENT_DATE = 7 OR f.next_maintenance_date <= CURRENT_DATE)
  LOOP
    INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    SELECT p.id,
           'Maintenance Due',
           CASE 
             WHEN rec.next_maintenance_date <= CURRENT_DATE THEN 
               format('Forklift %s maintenance is overdue (was due on %s)', rec.serial_number, rec.next_maintenance_date)
             ELSE 
               format('Forklift %s maintenance due in %s days (on %s)', rec.serial_number, (rec.next_maintenance_date - CURRENT_DATE), rec.next_maintenance_date)
           END,
           CASE WHEN rec.next_maintenance_date <= CURRENT_DATE THEN 'alert' ELSE 'warning' END,
           'forklift',
           rec.id
    FROM profiles p
    WHERE p.role IN ('admin', 'logistic_manager');
  END LOOP;

  FOR rec IN
    SELECT v.id, v.registration_number, v.next_inspection_date
    FROM vehicles v
    WHERE v.next_inspection_date IS NOT NULL
      AND v.status != 'out_of_service'
      AND (v.next_inspection_date - CURRENT_DATE = 30 OR v.next_inspection_date - CURRENT_DATE = 7 OR v.next_inspection_date <= CURRENT_DATE)
  LOOP
    INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    SELECT p.id,
           'Inspection Due',
           CASE 
             WHEN rec.next_inspection_date <= CURRENT_DATE THEN 
               format('Vehicle %s inspection is overdue (was due on %s)', rec.registration_number, rec.next_inspection_date)
             ELSE 
               format('Vehicle %s inspection due in %s days (on %s)', rec.registration_number, (rec.next_inspection_date - CURRENT_DATE), rec.next_inspection_date)
           END,
           CASE WHEN rec.next_inspection_date <= CURRENT_DATE THEN 'alert' ELSE 'warning' END,
           'vehicle',
           rec.id
    FROM profiles p
    WHERE p.role IN ('admin', 'logistic_manager');
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
