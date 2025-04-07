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
      clients: {
        Row: {
          address: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          isread: boolean | null
          isRead: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          isread?: boolean | null
          isRead?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          isread?: boolean | null
          isRead?: boolean | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      general_settings: {
        Row: {
          address: string | null
          adminEmail: string | null
          id: string
          phoneNumber: string | null
          siteTagline: string | null
          siteTitle: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          adminEmail?: string | null
          id?: string
          phoneNumber?: string | null
          siteTagline?: string | null
          siteTitle?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          adminEmail?: string | null
          id?: string
          phoneNumber?: string | null
          siteTagline?: string | null
          siteTitle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          imageUrl: string
          link: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          imageUrl: string
          link: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          imageUrl?: string
          link?: string
          title?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string
          title: string
        }
        Insert: {
          budget?: number | null
          client_id: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status: string
          title: string
        }
        Update: {
          budget?: number | null
          client_id?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          ai_generated: boolean
          client_id: string
          content: string | null
          created_at: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_generated: boolean
          client_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean
          client_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_proposals_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          benefits: string[]
          created_at: string | null
          description: string
          details: string
          icon: string
          id: string
          title: string
        }
        Insert: {
          benefits: string[]
          created_at?: string | null
          description: string
          details: string
          icon: string
          id?: string
          title: string
        }
        Update: {
          benefits?: string[]
          created_at?: string | null
          description?: string
          details?: string
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          facebook: string | null
          id: string
          instagram: string | null
          linkedin: string | null
          twitter: string | null
          updated_at: string | null
          youtube: string | null
        }
        Insert: {
          facebook?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          twitter?: string | null
          updated_at?: string | null
          youtube?: string | null
        }
        Update: {
          facebook?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          twitter?: string | null
          updated_at?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          company: string
          created_at: string | null
          id: string
          imageurl: string
          position: string
          quote: string
        }
        Insert: {
          author: string
          company: string
          created_at?: string | null
          id?: string
          imageurl: string
          position: string
          quote: string
        }
        Update: {
          author?: string
          company?: string
          created_at?: string | null
          id?: string
          imageurl?: string
          position?: string
          quote?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          role: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
