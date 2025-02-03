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
      admin_profiles: {
        Row: {
          alert_preferences: Json | null
          created_at: string
          display_preferences: Json | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
          zone: string | null
        }
        Insert: {
          alert_preferences?: Json | null
          created_at?: string
          display_preferences?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          zone?: string | null
        }
        Update: {
          alert_preferences?: Json | null
          created_at?: string
          display_preferences?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          zone?: string | null
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          click_count: number | null
          content: string
          created_at: string
          end_date: string
          id: string
          media_url: string | null
          metadata: Json | null
          priority: number | null
          start_date: string
          status: string
          target_zones: string[] | null
          title: string
          type: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          click_count?: number | null
          content: string
          created_at?: string
          end_date: string
          id?: string
          media_url?: string | null
          metadata?: Json | null
          priority?: number | null
          start_date: string
          status?: string
          target_zones?: string[] | null
          title: string
          type: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          click_count?: number | null
          content?: string
          created_at?: string
          end_date?: string
          id?: string
          media_url?: string | null
          metadata?: Json | null
          priority?: number | null
          start_date?: string
          status?: string
          target_zones?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      agent_locations: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          last_update: string | null
          latitude: number
          longitude: number
          metadata: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          last_update?: string | null
          latitude: number
          longitude: number
          metadata?: Json | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          last_update?: string | null
          latitude?: number
          longitude?: number
          metadata?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_locations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "parking_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blacklisted_plates: {
        Row: {
          added_by: string | null
          created_at: string
          evidence_urls: string[] | null
          expiry_date: string | null
          id: string
          license_plate: string
          metadata: Json | null
          notes: string | null
          reason: string
          status: string
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          evidence_urls?: string[] | null
          expiry_date?: string | null
          id?: string
          license_plate: string
          metadata?: Json | null
          notes?: string | null
          reason: string
          status?: string
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string
          evidence_urls?: string[] | null
          expiry_date?: string | null
          id?: string
          license_plate?: string
          metadata?: Json | null
          notes?: string | null
          reason?: string
          status?: string
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blacklisted_plates_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "parking_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      fine_notifications: {
        Row: {
          created_at: string
          delivery_status: string | null
          id: string
          infraction_id: string
          metadata: Json | null
          notification_type: string
          recipient_email: string
          recipient_phone: string | null
          sent_at: string | null
          status: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_status?: string | null
          id?: string
          infraction_id: string
          metadata?: Json | null
          notification_type?: string
          recipient_email: string
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_status?: string | null
          id?: string
          infraction_id?: string
          metadata?: Json | null
          notification_type?: string
          recipient_email?: string
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fine_notifications_infraction_id_fkey"
            columns: ["infraction_id"]
            isOneToOne: false
            referencedRelation: "infractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fine_notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      global_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      infraction_disputes: {
        Row: {
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          infraction_id: string
          reason: string
          resolution_notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          infraction_id: string
          reason: string
          resolution_notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          infraction_id?: string
          reason?: string
          resolution_notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "infraction_disputes_infraction_id_fkey"
            columns: ["infraction_id"]
            isOneToOne: false
            referencedRelation: "infractions"
            referencedColumns: ["id"]
          },
        ]
      }
      infraction_types: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      infractions: {
        Row: {
          agent_id: string
          amount: number
          created_at: string
          description: string | null
          evidence_url: string | null
          id: string
          image_evidence_urls: string[] | null
          infraction_type: string
          license_plate: string
          location: string
          payment_status: string
          status: string
          updated_at: string
          video_evidence_url: string | null
          zone_id: string
        }
        Insert: {
          agent_id: string
          amount: number
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          image_evidence_urls?: string[] | null
          infraction_type: string
          license_plate: string
          location: string
          payment_status?: string
          status?: string
          updated_at?: string
          video_evidence_url?: string | null
          zone_id: string
        }
        Update: {
          agent_id?: string
          amount?: number
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          image_evidence_urls?: string[] | null
          infraction_type?: string
          license_plate?: string
          location?: string
          payment_status?: string
          status?: string
          updated_at?: string
          video_evidence_url?: string | null
          zone_id?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          status: string
          subject: string | null
          type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          status?: string
          subject?: string | null
          type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          subject?: string | null
          type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          recipient_id: string | null
          sender_id: string
          status: string
          type: string
          updated_at: string
          voice_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          recipient_id?: string | null
          sender_id: string
          status?: string
          type: string
          updated_at?: string
          voice_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          recipient_id?: string | null
          sender_id?: string
          status?: string
          type?: string
          updated_at?: string
          voice_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          priority: string
          read_at: string | null
          scheduled_for: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          scheduled_for?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          scheduled_for?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parking_agents: {
        Row: {
          assigned_zones: string[] | null
          badge_number: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_location: Json | null
          last_name: string
          performance_metrics: Json | null
          performance_score: number | null
          phone: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_zones?: string[] | null
          badge_number: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_location?: Json | null
          last_name: string
          performance_metrics?: Json | null
          performance_score?: number | null
          phone: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_zones?: string[] | null
          badge_number?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_location?: Json | null
          last_name?: string
          performance_metrics?: Json | null
          performance_score?: number | null
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parking_zones: {
        Row: {
          capacity: number
          coordinates: Json
          created_at: string
          description: string | null
          features: Json | null
          id: string
          location: string
          name: string
          operating_hours: Json
          pricing: Json
          status: string
          updated_at: string
        }
        Insert: {
          capacity: number
          coordinates: Json
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          location: string
          name: string
          operating_hours?: Json
          pricing?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          coordinates?: Json
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          location?: string
          name?: string
          operating_hours?: Json
          pricing?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_method: string
          reference_id: string
          reference_type: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method: string
          reference_id: string
          reference_type: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string
          reference_id?: string
          reference_type?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          code: string
          created_at: string
          current_uses: number | null
          end_date: string
          id: string
          max_uses: number | null
          name: string
          start_date: string
          status: string
          subscription_type: string | null
          type: string
          updated_at: string
          value: number
          zone_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number | null
          end_date: string
          id?: string
          max_uses?: number | null
          name: string
          start_date: string
          status?: string
          subscription_type?: string | null
          type: string
          updated_at?: string
          value: number
          zone_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number | null
          end_date?: string
          id?: string
          max_uses?: number | null
          name?: string
          start_date?: string
          status?: string
          subscription_type?: string | null
          type?: string
          updated_at?: string
          value?: number
          zone_id?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          amount: number
          created_at: string
          end_time: string
          id: string
          payment_status: string
          start_time: string
          status: string
          updated_at: string
          user_id: string
          zone_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_time: string
          id?: string
          payment_status?: string
          start_time: string
          status?: string
          updated_at?: string
          user_id: string
          zone_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_time?: string
          id?: string
          payment_status?: string
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
          zone_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permissions: string[]
          resource: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions: string[]
          resource: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: string[]
          resource?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string
          created_by: string | null
          format: string
          id: string
          last_run: string | null
          name: string
          parameters: Json | null
          recipients: Json
          schedule: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          format: string
          id?: string
          last_run?: string | null
          name: string
          parameters?: Json | null
          recipients?: Json
          schedule: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          format?: string
          id?: string
          last_run?: string | null
          name?: string
          parameters?: Json | null
          recipients?: Json
          schedule?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          address: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          phone: string | null
          rating: number | null
          status: string
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          phone?: string | null
          rating?: number | null
          status?: string
          type: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          phone?: string | null
          rating?: number | null
          status?: string
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          end_date: string
          id: string
          payment_status: string
          start_date: string
          status: string
          type: string
          updated_at: string
          user_id: string
          zone_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_date: string
          id?: string
          payment_status?: string
          start_date: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
          zone_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string
          id?: string
          payment_status?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
          zone_id?: string
        }
        Relationships: []
      }
      user_status_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          reason: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          reason: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          reason?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_ip: string | null
          last_login: string | null
          last_name: string | null
          metadata: Json | null
          phone: string | null
          role: string
          status: string
          updated_at: string
          zone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_ip?: string | null
          last_login?: string | null
          last_name?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
          zone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_ip?: string | null
          last_login?: string | null
          last_name?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_zone_fkey"
            columns: ["zone"]
            isOneToOne: false
            referencedRelation: "parking_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          color: string
          created_at: string
          id: string
          license_plate: string
          model: string
          status: string
          type: string
          updated_at: string
          user_id: string
          year: number | null
        }
        Insert: {
          brand: string
          color: string
          created_at?: string
          id?: string
          license_plate: string
          model: string
          status?: string
          type?: string
          updated_at?: string
          user_id: string
          year?: number | null
        }
        Update: {
          brand?: string
          color?: string
          created_at?: string
          id?: string
          license_plate?: string
          model?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
