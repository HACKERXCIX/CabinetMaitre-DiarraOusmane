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
      analysis_history: {
        Row: {
          analysis_date: string
          created_at: string
          detected_symptoms: string[] | null
          id: number
          patient_id: number | null
          provisional_diagnosis: string | null
          updated_at: string
        }
        Insert: {
          analysis_date?: string
          created_at?: string
          detected_symptoms?: string[] | null
          id?: number
          patient_id?: number | null
          provisional_diagnosis?: string | null
          updated_at?: string
        }
        Update: {
          analysis_date?: string
          created_at?: string
          detected_symptoms?: string[] | null
          id?: number
          patient_id?: number | null
          provisional_diagnosis?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_time: string
          client_type: string
          consultation_object: string
          consultation_summary: string
          consultation_type: string
          created_at: string | null
          desired_date: string
          email: string
          first_name: string
          full_name: string
          id: string
          last_name: string
          message: string | null
          online_platform: string | null
          payment_receipt_url: string
          phone: string
          property_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_time?: string
          client_type?: string
          consultation_object?: string
          consultation_summary?: string
          consultation_type?: string
          created_at?: string | null
          desired_date: string
          email: string
          first_name?: string
          full_name: string
          id?: string
          last_name?: string
          message?: string | null
          online_platform?: string | null
          payment_receipt_url?: string
          phone: string
          property_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          appointment_time?: string
          client_type?: string
          consultation_object?: string
          consultation_summary?: string
          consultation_type?: string
          created_at?: string | null
          desired_date?: string
          email?: string
          first_name?: string
          full_name?: string
          id?: string
          last_name?: string
          message?: string | null
          online_platform?: string | null
          payment_receipt_url?: string
          phone?: string
          property_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          doctor_email: string
          id: number
          patient_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          doctor_email: string
          id?: number
          patient_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          doctor_email?: string
          id?: number
          patient_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_reports: {
        Row: {
          analysis_id: number | null
          created_at: string | null
          detected_symptoms: string[] | null
          id: number
          notes: string | null
          patient_id: number | null
          prescription_id: number | null
          provisional_diagnosis: string | null
          updated_at: string | null
          vital_signs: Json | null
        }
        Insert: {
          analysis_id?: number | null
          created_at?: string | null
          detected_symptoms?: string[] | null
          id?: never
          notes?: string | null
          patient_id?: number | null
          prescription_id?: number | null
          provisional_diagnosis?: string | null
          updated_at?: string | null
          vital_signs?: Json | null
        }
        Update: {
          analysis_id?: number | null
          created_at?: string | null
          detected_symptoms?: string[] | null
          id?: never
          notes?: string | null
          patient_id?: number | null
          prescription_id?: number | null
          provisional_diagnosis?: string | null
          updated_at?: string | null
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "intervention_reports_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analysis_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_reports_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          order_index: number
          parent_id: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          order_index: number
          parent_id?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          order_index?: number
          parent_id?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      pathologies: {
        Row: {
          created_at: string
          id: number
          linked_symptoms: string[] | null
          name: string
          recommended_treatments: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          linked_symptoms?: string[] | null
          name: string
          recommended_treatments?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          linked_symptoms?: string[] | null
          name?: string
          recommended_treatments?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          admission_date: string | null
          age: number | null
          created_at: string
          discharge_date: string | null
          external_id: string | null
          full_name: string | null
          gender: string | null
          id: number
          status: string | null
          triage_status: string | null
          updated_at: string
        }
        Insert: {
          admission_date?: string | null
          age?: number | null
          created_at?: string
          discharge_date?: string | null
          external_id?: string | null
          full_name?: string | null
          gender?: string | null
          id?: number
          status?: string | null
          triage_status?: string | null
          updated_at?: string
        }
        Update: {
          admission_date?: string | null
          age?: number | null
          created_at?: string
          discharge_date?: string | null
          external_id?: string | null
          full_name?: string | null
          gender?: string | null
          id?: number
          status?: string | null
          triage_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prescription_history: {
        Row: {
          created_at: string | null
          follow_up: Json | null
          id: number
          instructions: Json | null
          is_favorite: boolean | null
          medications: Json
          modified_at: string | null
          precautions: Json | null
          prescription_id: number | null
        }
        Insert: {
          created_at?: string | null
          follow_up?: Json | null
          id?: number
          instructions?: Json | null
          is_favorite?: boolean | null
          medications: Json
          modified_at?: string | null
          precautions?: Json | null
          prescription_id?: number | null
        }
        Update: {
          created_at?: string | null
          follow_up?: Json | null
          id?: number
          instructions?: Json | null
          is_favorite?: boolean | null
          medications?: Json
          modified_at?: string | null
          precautions?: Json | null
          prescription_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prescription_history_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_logs: {
        Row: {
          created_at: string | null
          id: number
          modification_type: string
          modified_by: string | null
          new_state: Json | null
          prescription_id: number | null
          previous_state: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          modification_type: string
          modified_by?: string | null
          new_state?: Json | null
          prescription_id?: number | null
          previous_state?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: never
          modification_type?: string
          modified_by?: string | null
          new_state?: Json | null
          prescription_id?: number | null
          previous_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "prescription_logs_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_validations: {
        Row: {
          created_at: string | null
          id: number
          prescription_id: number | null
          validated_by: string | null
          validation_date: string | null
          validation_notes: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          prescription_id?: number | null
          validated_by?: string | null
          validation_date?: string | null
          validation_notes?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          prescription_id?: number | null
          validated_by?: string | null
          validation_date?: string | null
          validation_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescription_validations_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          diagnosis: string
          id: number
          instructions: Json | null
          medications: Json
          symptoms: Json
          updated_at: string
          validation_status: string | null
        }
        Insert: {
          created_at?: string
          diagnosis: string
          id?: number
          instructions?: Json | null
          medications: Json
          symptoms: Json
          updated_at?: string
          validation_status?: string | null
        }
        Update: {
          created_at?: string
          diagnosis?: string
          id?: number
          instructions?: Json | null
          medications?: Json
          symptoms?: Json
          updated_at?: string
          validation_status?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          architecture_style: string | null
          created_at: string | null
          deleted_at: string | null
          description: string
          id: string
          images: string[]
          location: string
          price: number
          property_type: string
          rooms: number | null
          surface: number
          title: string
          type: string
          updated_at: string | null
          videos: string[] | null
        }
        Insert: {
          architecture_style?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description: string
          id?: string
          images?: string[]
          location: string
          price: number
          property_type: string
          rooms?: number | null
          surface: number
          title: string
          type: string
          updated_at?: string | null
          videos?: string[] | null
        }
        Update: {
          architecture_style?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          id?: string
          images?: string[]
          location?: string
          price?: number
          property_type?: string
          rooms?: number | null
          surface?: number
          title?: string
          type?: string
          updated_at?: string | null
          videos?: string[] | null
        }
        Relationships: []
      }
      property_search_stats: {
        Row: {
          architecture_preference: string | null
          id: string
          location_preference: string | null
          price_range_max: number | null
          price_range_min: number | null
          property_id: string | null
          search_date: string | null
          search_type: string | null
          visitor_ip: string | null
        }
        Insert: {
          architecture_preference?: string | null
          id?: string
          location_preference?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          property_id?: string | null
          search_date?: string | null
          search_type?: string | null
          visitor_ip?: string | null
        }
        Update: {
          architecture_preference?: string | null
          id?: string
          location_preference?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          property_id?: string | null
          search_date?: string | null
          search_type?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_search_stats_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_visits: {
        Row: {
          id: string
          property_id: string | null
          search_criteria: Json | null
          visited_at: string | null
          visitor_ip: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          search_criteria?: Json | null
          visited_at?: string | null
          visitor_ip?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          search_criteria?: Json | null
          visited_at?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          id: string
          page: string
          user_agent: string | null
          visited_at: string | null
          visitor_ip: string | null
        }
        Insert: {
          id?: string
          page: string
          user_agent?: string | null
          visited_at?: string | null
          visitor_ip?: string | null
        }
        Update: {
          id?: string
          page?: string
          user_agent?: string | null
          visited_at?: string | null
          visitor_ip?: string | null
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          associated_pathologies: string[] | null
          created_at: string
          id: number
          initial_recommendations: string | null
          name: string
          severity: number | null
          updated_at: string
        }
        Insert: {
          associated_pathologies?: string[] | null
          created_at?: string
          id?: number
          initial_recommendations?: string | null
          name: string
          severity?: number | null
          updated_at?: string
        }
        Update: {
          associated_pathologies?: string[] | null
          created_at?: string
          id?: number
          initial_recommendations?: string | null
          name?: string
          severity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
