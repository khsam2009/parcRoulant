-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forklifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS user_role AS $$
DECLARE
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val
  FROM profiles
  WHERE id = user_uuid;
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role(user_uuid) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (is_admin(auth.uid()));

-- Vehicles policies
CREATE POLICY "Everyone can view vehicles" ON vehicles
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage vehicles" ON vehicles
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Logistic managers can manage vehicles" ON vehicles
  FOR ALL USING (get_user_role(auth.uid()) = 'logistic_manager');

CREATE POLICY "Drivers can update their assigned vehicles" ON vehicles
  FOR UPDATE USING (assigned_driver_id = auth.uid() AND get_user_role(auth.uid()) = 'driver');

-- Drivers policies
CREATE POLICY "Everyone can view drivers" ON drivers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage drivers" ON drivers
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Logistic managers can manage drivers" ON drivers
  FOR ALL USING (get_user_role(auth.uid()) = 'logistic_manager');

CREATE POLICY "Drivers can view their own driver record" ON drivers
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Drivers can update their own driver record" ON drivers
  FOR UPDATE USING (id = auth.uid());

-- Warehouses policies
CREATE POLICY "Everyone can view warehouses" ON warehouses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage warehouses" ON warehouses
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Logistic managers can manage warehouses" ON warehouses
  FOR ALL USING (get_user_role(auth.uid()) = 'logistic_manager');

-- Shipments policies
CREATE POLICY "Admins can view all shipments" ON shipments
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all shipments" ON shipments
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Logistic managers can view all shipments" ON shipments
  FOR SELECT USING (get_user_role(auth.uid()) = 'logistic_manager');

CREATE POLICY "Logistic managers can manage shipments" ON shipments
  FOR ALL USING (get_user_role(auth.uid()) = 'logistic_manager');

CREATE POLICY "Drivers can view their assigned shipments" ON shipments
  FOR SELECT USING (assigned_driver_id = auth.uid() AND get_user_role(auth.uid()) = 'driver');

CREATE POLICY "Drivers can update status of their assigned shipments" ON shipments
  FOR UPDATE USING (assigned_driver_id = auth.uid() AND get_user_role(auth.uid()) = 'driver')
  WITH CHECK (assigned_driver_id = auth.uid() AND get_user_role(auth.uid()) = 'driver');

CREATE POLICY "Forklift drivers can view shipments in their warehouse" ON shipments
  FOR SELECT USING (
    assigned_forklift_driver_id = auth.uid() AND 
    get_user_role(auth.uid()) = 'forklift_driver'
  );

-- Forklifts policies
CREATE POLICY "Everyone can view forklifts" ON forklifts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage forklifts" ON forklifts
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Logistic managers can manage forklifts" ON forklifts
  FOR ALL USING (get_user_role(auth.uid()) = 'logistic_manager');

CREATE POLICY "Forklift drivers can update their assigned forklift" ON forklifts
  FOR UPDATE USING (assigned_operator_id = auth.uid() AND get_user_role(auth.uid()) = 'forklift_driver');

-- Maintenance records policies
CREATE POLICY "Everyone can view maintenance records" ON maintenance_records
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage maintenance records" ON maintenance_records
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Logistic managers can manage maintenance records" ON maintenance_records
  FOR ALL USING (get_user_role(auth.uid()) = 'logistic_manager');

-- Documents policies
CREATE POLICY "Admins can manage all documents" ON documents
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Logistic managers can manage documents" ON documents
  FOR ALL USING (get_user_role(auth.uid()) = 'logistic_manager');

CREATE POLICY "Drivers can view their own documents" ON documents
  FOR SELECT USING (
    entity_type = 'driver' AND 
    entity_id = auth.uid() AND 
    get_user_role(auth.uid()) = 'driver'
  );

CREATE POLICY "Drivers can upload their own documents" ON documents
  FOR INSERT WITH CHECK (
    entity_type = 'driver' AND 
    entity_id = auth.uid() AND 
    get_user_role(auth.uid()) = 'driver'
  );

CREATE POLICY "Vehicle owners/drivers can view vehicle documents" ON documents
  FOR SELECT USING (
    entity_type = 'vehicle' AND 
    EXISTS (
      SELECT 1 FROM vehicles v 
      WHERE v.id = documents.entity_id AND v.assigned_driver_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (is_admin(auth.uid()));
