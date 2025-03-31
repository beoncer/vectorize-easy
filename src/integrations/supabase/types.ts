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
      analytics: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          credits_used: number
          id: string
          timestamp: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          credits_used: number
          id?: string
          timestamp?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          credits_used?: number
          id?: string
          timestamp?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_credits"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_packages: {
        Row: {
          created_at: string | null
          credits_amount: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          stripe_price_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_amount: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          stripe_price_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_amount?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          stripe_price_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string | null
          expires_at: string
          height: number
          id: string
          mime_type: string
          original_name: string
          path: string
          size: number
          updated_at: string | null
          user_id: string
          was_resized: boolean | null
          width: number
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          height: number
          id?: string
          mime_type: string
          original_name: string
          path: string
          size: number
          updated_at?: string | null
          user_id: string
          was_resized?: boolean | null
          width: number
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          height?: number
          id?: string
          mime_type?: string
          original_name?: string
          path?: string
          size?: number
          updated_at?: string | null
          user_id?: string
          was_resized?: boolean | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_paid: number | null
          billing_address: string | null
          company_name: string | null
          created_at: string | null
          credits_added: number | null
          credits_amount: number
          currency: string | null
          download_url: string | null
          expiration_time: string | null
          file_name: string | null
          id: string
          invoice_url: string | null
          pack_name: string | null
          previews_added: number | null
          status: string
          stripe_payment_id: string | null
          timestamp: string | null
          type: string
          updated_at: string | null
          user_id: string
          vat_amount: number | null
          vat_country: string | null
          vat_id: string | null
          vat_rate: number | null
        }
        Insert: {
          amount_paid?: number | null
          billing_address?: string | null
          company_name?: string | null
          created_at?: string | null
          credits_added?: number | null
          credits_amount: number
          currency?: string | null
          download_url?: string | null
          expiration_time?: string | null
          file_name?: string | null
          id?: string
          invoice_url?: string | null
          pack_name?: string | null
          previews_added?: number | null
          status: string
          stripe_payment_id?: string | null
          timestamp?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          vat_amount?: number | null
          vat_country?: string | null
          vat_id?: string | null
          vat_rate?: number | null
        }
        Update: {
          amount_paid?: number | null
          billing_address?: string | null
          company_name?: string | null
          created_at?: string | null
          credits_added?: number | null
          credits_amount?: number
          currency?: string | null
          download_url?: string | null
          expiration_time?: string | null
          file_name?: string | null
          id?: string
          invoice_url?: string | null
          pack_name?: string | null
          previews_added?: number | null
          status?: string
          stripe_payment_id?: string | null
          timestamp?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          vat_amount?: number | null
          vat_country?: string | null
          vat_id?: string | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_credits"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          credit_balance: number | null
          free_previews: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credit_balance?: number | null
          free_previews?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credit_balance?: number | null
          free_previews?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          billing_address: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
          user_id: string
          vat_id: string | null
        }
        Insert: {
          billing_address?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          vat_id?: string | null
        }
        Update: {
          billing_address?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          vat_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          default_vectorization_options: Json | null
          notification_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_vectorization_options?: Json | null
          notification_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_vectorization_options?: Json | null
          notification_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vectorized_images: {
        Row: {
          created_at: string | null
          download_count: number | null
          expires_at: string
          format: string
          id: string
          image_id: string
          path: string
          size: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          download_count?: number | null
          expires_at: string
          format: string
          id?: string
          image_id: string
          path: string
          size: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          download_count?: number | null
          expires_at?: string
          format?: string
          id?: string
          image_id?: string
          path?: string
          size?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vectorized_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vectorized_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_vat_amount: {
        Args: {
          amount: number
          country: string
          vat_id: string
        }
        Returns: number
      }
      validate_vat_number: {
        Args: {
          vat_id: string
        }
        Returns: boolean
      }
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
