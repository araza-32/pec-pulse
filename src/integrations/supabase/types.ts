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
      workbodies: {
        Row: {
          actions_agreed: number | null
          actions_completed: number | null
          created_at: string | null
          created_date: string
          description: string | null
          end_date: string | null
          id: string
          meetings_this_year: number | null
          name: string
          terms_of_reference: string | null
          total_meetings: number | null
          type: string
        }
        Insert: {
          actions_agreed?: number | null
          actions_completed?: number | null
          created_at?: string | null
          created_date: string
          description?: string | null
          end_date?: string | null
          id?: string
          meetings_this_year?: number | null
          name: string
          terms_of_reference?: string | null
          total_meetings?: number | null
          type: string
        }
        Update: {
          actions_agreed?: number | null
          actions_completed?: number | null
          created_at?: string | null
          created_date?: string
          description?: string | null
          end_date?: string | null
          id?: string
          meetings_this_year?: number | null
          name?: string
          terms_of_reference?: string | null
          total_meetings?: number | null
          type?: string
        }
        Relationships: []
      }
      workbody_documents: {
        Row: {
          document_type: string
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
          workbody_id: string
        }
        Insert: {
          document_type: string
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          workbody_id: string
        }
        Update: {
          document_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          workbody_id?: string
        }
        Relationships: []
      }
      workbody_members: {
        Row: {
          created_at: string | null
          email: string | null
          has_cv: boolean | null
          id: string
          name: string
          phone: string | null
          role: string
          source_document_id: string | null
          workbody_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          has_cv?: boolean | null
          id?: string
          name: string
          phone?: string | null
          role: string
          source_document_id?: string | null
          workbody_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          has_cv?: boolean | null
          id?: string
          name?: string
          phone?: string | null
          role?: string
          source_document_id?: string | null
          workbody_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workbody_members_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "workbody_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workbody_members_workbody_id_fkey"
            columns: ["workbody_id"]
            isOneToOne: false
            referencedRelation: "workbodies"
            referencedColumns: ["id"]
          },
        ]
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
