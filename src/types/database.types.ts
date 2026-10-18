/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'logistic_manager' | 'forklift_driver' | 'driver'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'logistic_manager' | 'forklift_driver' | 'driver'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'logistic_manager' | 'forklift_driver' | 'driver'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          id: string
          registration_number: string
          make: string
          model: string
          year: number
          vin: string | null
          fuel_type: string
          mileage: number
          status: 'available' | 'in_use' | 'maintenance' | 'out_of_service'
          assigned_driver_id: string | null
          last_inspection_date: string | null
          next_inspection_date: string | null
          insurance_expiry: string | null
          license_plate: string | null
          capacity_kg: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registration_number: string
          make: string
          model: string
          year: number
          vin?: string | null
          fuel_type: string
          mileage?: number
          status?: 'available' | 'in_use' | 'maintenance' | 'out_of_service'
          assigned_driver_id?: string | null
          last_inspection_date?: string | null
          next_inspection_date?: string | null
          insurance_expiry?: string | null
          license_plate?: string | null
          capacity_kg?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registration_number?: string
          make?: string
          model?: string
          year?: number
          vin?: string | null
          fuel_type?: string
          mileage?: number
          status?: 'available' | 'in_use' | 'maintenance' | 'out_of_service'
          assigned_driver_id?: string | null
          last_inspection_date?: string | null
          next_inspection_date?: string | null
          insurance_expiry?: string | null
          license_plate?: string | null
          capacity_kg?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      drivers: {
        Row: {
          id: string
          license_number: string
          license_type: string
          license_expiry: string
          phone: string | null
          address: string | null
          emergency_contact: string | null
          emergency_contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          license_number: string
          license_type: string
          license_expiry: string
          phone?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          license_number?: string
          license_type?: string
          license_expiry?: string
          phone?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      warehouses: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          country: string
          manager_id: string | null
          capacity_m3: number | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          country: string
          manager_id?: string | null
          capacity_m3?: number | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          country?: string
          manager_id?: string | null
          capacity_m3?: number | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      shipments: {
        Row: {
          id: string
          tracking_number: string
          origin_warehouse_id: string | null
          destination_address: string
          destination_city: string
          destination_country: string
          customer_name: string
          customer_phone: string | null
          customer_email: string | null
          weight_kg: number
          volume_m3: number | null
          status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled' | 'failed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_driver_id: string | null
          assigned_vehicle_id: string | null
          assigned_forklift_driver_id: string | null
          estimated_delivery_date: string | null
          actual_delivery_date: string | null
          pickup_date: string | null
          delivery_notes: string | null
          value: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tracking_number: string
          origin_warehouse_id?: string | null
          destination_address: string
          destination_city: string
          destination_country: string
          customer_name: string
          customer_phone?: string | null
          customer_email?: string | null
          weight_kg: number
          volume_m3?: number | null
          status?: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled' | 'failed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_driver_id?: string | null
          assigned_vehicle_id?: string | null
          assigned_forklift_driver_id?: string | null
          estimated_delivery_date?: string | null
          actual_delivery_date?: string | null
          pickup_date?: string | null
          delivery_notes?: string | null
          value?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tracking_number?: string
          origin_warehouse_id?: string | null
          destination_address?: string
          destination_city?: string
          destination_country?: string
          customer_name?: string
          customer_phone?: string | null
          customer_email?: string | null
          weight_kg?: number
          volume_m3?: number | null
          status?: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled' | 'failed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_driver_id?: string | null
          assigned_vehicle_id?: string | null
          assigned_forklift_driver_id?: string | null
          estimated_delivery_date?: string | null
          actual_delivery_date?: string | null
          pickup_date?: string | null
          delivery_notes?: string | null
          value?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      forklifts: {
        Row: {
          id: string
          serial_number: string
          model: string
          manufacturer: string
          year: number
          capacity_kg: number
          status: 'available' | 'in_use' | 'maintenance' | 'out_of_service'
          warehouse_id: string | null
          assigned_operator_id: string | null
          last_maintenance_date: string | null
          next_maintenance_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          serial_number: string
          model: string
          manufacturer: string
          year: number
          capacity_kg: number
          status?: 'available' | 'in_use' | 'maintenance' | 'out_of_service'
          warehouse_id?: string | null
          assigned_operator_id?: string | null
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          serial_number?: string
          model?: string
          manufacturer?: string
          year?: number
          capacity_kg?: number
          status?: 'available' | 'in_use' | 'maintenance' | 'out_of_service'
          warehouse_id?: string | null
          assigned_operator_id?: string | null
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          id: string
          vehicle_id: string | null
          forklift_id: string | null
          type: 'routine' | 'repair' | 'inspection' | 'emergency'
          description: string
          cost: number | null
          performed_by: string | null
          performed_at: string
          next_due_date: string | null
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id?: string | null
          forklift_id?: string | null
          type: 'routine' | 'repair' | 'inspection' | 'emergency'
          description: string
          cost?: number | null
          performed_by?: string | null
          performed_at: string
          next_due_date?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string | null
          forklift_id?: string | null
          type?: 'routine' | 'repair' | 'inspection' | 'emergency'
          description?: string
          cost?: number | null
          performed_by?: string | null
          performed_at?: string
          next_due_date?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          entity_type: 'vehicle' | 'driver' | 'forklift'
          entity_id: string
          document_type: string
          file_name: string
          file_url: string
          expiry_date: string | null
          issued_date: string | null
          issuing_authority: string | null
          status: 'active' | 'expired' | 'revoked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          entity_type: 'vehicle' | 'driver' | 'forklift'
          entity_id: string
          document_type: string
          file_name: string
          file_url: string
          expiry_date?: string | null
          issued_date?: string | null
          issuing_authority?: string | null
          status?: 'active' | 'expired' | 'revoked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          entity_type?: 'vehicle' | 'driver' | 'forklift'
          entity_id?: string
          document_type?: string
          file_name?: string
          file_url?: string
          expiry_date?: string | null
          issued_date?: string | null
          issuing_authority?: string | null
          status?: 'active' | 'expired' | 'revoked'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'alert' | 'success'
          read: boolean
          related_entity_type: string | null
          related_entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'alert' | 'success'
          read?: boolean
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'alert' | 'success'
          read?: boolean
          related_entity_type?: string | null
          related_entity_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: 'admin' | 'logistic_manager' | 'forklift_driver' | 'driver'
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_document_expiry: {
        Args: unknown
        Returns: void
      }
      check_maintenance_due: {
        Args: unknown
        Returns: void
      }
    }
    Enums: {
      user_role: 'admin' | 'logistic_manager' | 'forklift_driver' | 'driver'
    }
    CompositeTypes: {}
  }
}
