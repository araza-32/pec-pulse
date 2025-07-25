export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          after_data: Json | null
          before_data: Json | null
          changed_at: string
          changed_by: string | null
          id: string
          ip_address: unknown | null
          operation: string
          record_id: string
          table_name: string
          user_agent: string | null
        }
        Insert: {
          after_data?: Json | null
          before_data?: Json | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          ip_address?: unknown | null
          operation: string
          record_id: string
          table_name: string
          user_agent?: string | null
        }
        Update: {
          after_data?: Json | null
          before_data?: Json | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          ip_address?: unknown | null
          operation?: string
          record_id?: string
          table_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      meeting_minutes: {
        Row: {
          actions_agreed: string[]
          agenda_document_url: string | null
          agenda_items: string[]
          date: string
          file_url: string
          id: string
          location: string
          ocr_status: string | null
          ocr_text: string | null
          uploaded_at: string
          uploaded_by: string | null
          workbody_id: string | null
        }
        Insert: {
          actions_agreed?: string[]
          agenda_document_url?: string | null
          agenda_items?: string[]
          date: string
          file_url: string
          id?: string
          location: string
          ocr_status?: string | null
          ocr_text?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          workbody_id?: string | null
        }
        Update: {
          actions_agreed?: string[]
          agenda_document_url?: string | null
          agenda_items?: string[]
          date?: string
          file_url?: string
          id?: string
          location?: string
          ocr_status?: string | null
          ocr_text?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          workbody_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_minutes_workbody_id_fkey"
            columns: ["workbody_id"]
            isOneToOne: false
            referencedRelation: "workbodies"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_minutes_summaries: {
        Row: {
          action_items: Json | null
          created_at: string
          decisions: Json | null
          id: string
          meeting_minutes_id: string
          performance_analysis: Json | null
          sentiment_score: number | null
          summary_text: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          action_items?: Json | null
          created_at?: string
          decisions?: Json | null
          id?: string
          meeting_minutes_id: string
          performance_analysis?: Json | null
          sentiment_score?: number | null
          summary_text: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          action_items?: Json | null
          created_at?: string
          decisions?: Json | null
          id?: string
          meeting_minutes_id?: string
          performance_analysis?: Json | null
          sentiment_score?: number | null
          summary_text?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_minutes_summaries_meeting_minutes_id_fkey"
            columns: ["meeting_minutes_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          agenda_items: string[] | null
          created_at: string
          created_by: string | null
          datetime: string
          id: string
          location: string | null
          status: string
          title: string
          updated_at: string
          workbody_id: string | null
        }
        Insert: {
          agenda_items?: string[] | null
          created_at?: string
          created_by?: string | null
          datetime: string
          id?: string
          location?: string | null
          status?: string
          title: string
          updated_at?: string
          workbody_id?: string | null
        }
        Update: {
          agenda_items?: string[] | null
          created_at?: string
          created_by?: string | null
          datetime?: string
          id?: string
          location?: string | null
          status?: string
          title?: string
          updated_at?: string
          workbody_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_workbody_id_fkey"
            columns: ["workbody_id"]
            isOneToOne: false
            referencedRelation: "workbodies"
            referencedColumns: ["id"]
          },
        ]
      }
      minute_summaries: {
        Row: {
          actions: Json | null
          ai_model: string | null
          decisions: Json | null
          generated_at: string
          id: string
          minute_id: string | null
          summary: string | null
        }
        Insert: {
          actions?: Json | null
          ai_model?: string | null
          decisions?: Json | null
          generated_at?: string
          id?: string
          minute_id?: string | null
          summary?: string | null
        }
        Update: {
          actions?: Json | null
          ai_model?: string | null
          decisions?: Json | null
          generated_at?: string
          id?: string
          minute_id?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "minute_summaries_minute_id_fkey"
            columns: ["minute_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_targets: {
        Row: {
          created_at: string | null
          danger_threshold: number
          id: string
          metric_name: string
          target_value: number
          updated_at: string | null
          warning_threshold: number
        }
        Insert: {
          created_at?: string | null
          danger_threshold: number
          id?: string
          metric_name: string
          target_value: number
          updated_at?: string | null
          warning_threshold: number
        }
        Update: {
          created_at?: string | null
          danger_threshold?: number
          id?: string
          metric_name?: string
          target_value?: number
          updated_at?: string | null
          warning_threshold?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          invite_expires: string | null
          invite_token: string | null
          name: string | null
          phone: string | null
          role: string
          status: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          invite_expires?: string | null
          invite_token?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          status?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          invite_expires?: string | null
          invite_token?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      report_history: {
        Row: {
          created_at: string
          download_url: string | null
          file_size: number | null
          format: string
          generated_by: string
          id: string
          name: string
          parameters: Json
          type: string
          updated_at: string
          workbody_name: string | null
          workbody_type: string
        }
        Insert: {
          created_at?: string
          download_url?: string | null
          file_size?: number | null
          format: string
          generated_by: string
          id?: string
          name: string
          parameters?: Json
          type: string
          updated_at?: string
          workbody_name?: string | null
          workbody_type: string
        }
        Update: {
          created_at?: string
          download_url?: string | null
          file_size?: number | null
          format?: string
          generated_by?: string
          id?: string
          name?: string
          parameters?: Json
          type?: string
          updated_at?: string
          workbody_name?: string | null
          workbody_type?: string
        }
        Relationships: []
      }
      scheduled_meetings: {
        Row: {
          agenda_file_name: string | null
          agenda_file_path: string | null
          agenda_items: string[]
          created_at: string
          date: string
          id: string
          location: string
          notification_file: string | null
          notification_file_name: string | null
          notification_file_path: string | null
          time: string
          workbody_id: string
          workbody_name: string
        }
        Insert: {
          agenda_file_name?: string | null
          agenda_file_path?: string | null
          agenda_items?: string[]
          created_at?: string
          date: string
          id?: string
          location: string
          notification_file?: string | null
          notification_file_name?: string | null
          notification_file_path?: string | null
          time: string
          workbody_id: string
          workbody_name: string
        }
        Update: {
          agenda_file_name?: string | null
          agenda_file_path?: string | null
          agenda_items?: string[]
          created_at?: string
          date?: string
          id?: string
          location?: string
          notification_file?: string | null
          notification_file_name?: string | null
          notification_file_path?: string | null
          time?: string
          workbody_id?: string
          workbody_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_meetings_workbody_id_fkey"
            columns: ["workbody_id"]
            isOneToOne: false
            referencedRelation: "workbodies"
            referencedColumns: ["id"]
          },
        ]
      }
      workbodies: {
        Row: {
          action_item_completion: number | null
          actions_agreed: number | null
          actions_completed: number | null
          attendance_rate: number | null
          average_decision_turnaround: number | null
          category: string | null
          created_at: string | null
          created_date: string
          cross_workbody_collaborations: number | null
          deliverable_quality_score: number | null
          description: string | null
          doc_submission_timeliness: number | null
          end_date: string | null
          id: string
          meetings_held: number | null
          meetings_this_year: number | null
          member_turnover: number | null
          name: string
          parent_id: string | null
          recommendations_issued: number | null
          subcategory: string | null
          terms_of_reference: string | null
          total_meetings: number | null
          type: string
        }
        Insert: {
          action_item_completion?: number | null
          actions_agreed?: number | null
          actions_completed?: number | null
          attendance_rate?: number | null
          average_decision_turnaround?: number | null
          category?: string | null
          created_at?: string | null
          created_date: string
          cross_workbody_collaborations?: number | null
          deliverable_quality_score?: number | null
          description?: string | null
          doc_submission_timeliness?: number | null
          end_date?: string | null
          id?: string
          meetings_held?: number | null
          meetings_this_year?: number | null
          member_turnover?: number | null
          name: string
          parent_id?: string | null
          recommendations_issued?: number | null
          subcategory?: string | null
          terms_of_reference?: string | null
          total_meetings?: number | null
          type: string
        }
        Update: {
          action_item_completion?: number | null
          actions_agreed?: number | null
          actions_completed?: number | null
          attendance_rate?: number | null
          average_decision_turnaround?: number | null
          category?: string | null
          created_at?: string | null
          created_date?: string
          cross_workbody_collaborations?: number | null
          deliverable_quality_score?: number | null
          description?: string | null
          doc_submission_timeliness?: number | null
          end_date?: string | null
          id?: string
          meetings_held?: number | null
          meetings_this_year?: number | null
          member_turnover?: number | null
          name?: string
          parent_id?: string | null
          recommendations_issued?: number | null
          subcategory?: string | null
          terms_of_reference?: string | null
          total_meetings?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workbodies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "workbodies"
            referencedColumns: ["id"]
          },
        ]
      }
      workbody_composition: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: string
          status: string
          user_id: string | null
          workbody_id: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: string
          status?: string
          user_id?: string | null
          workbody_id?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: string
          status?: string
          user_id?: string | null
          workbody_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workbody_composition_workbody_id_fkey"
            columns: ["workbody_id"]
            isOneToOne: false
            referencedRelation: "workbodies"
            referencedColumns: ["id"]
          },
        ]
      }
      workbody_composition_history: {
        Row: {
          change_details: Json
          change_type: string
          changed_at: string
          changed_by: string
          created_at: string
          id: string
          notes: string | null
          source_document: string | null
          workbody_id: string | null
        }
        Insert: {
          change_details?: Json
          change_type: string
          changed_at?: string
          changed_by: string
          created_at?: string
          id?: string
          notes?: string | null
          source_document?: string | null
          workbody_id?: string | null
        }
        Update: {
          change_details?: Json
          change_type?: string
          changed_at?: string
          changed_by?: string
          created_at?: string
          id?: string
          notes?: string | null
          source_document?: string | null
          workbody_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workbody_composition_history_workbody_id_fkey"
            columns: ["workbody_id"]
            isOneToOne: false
            referencedRelation: "workbodies"
            referencedColumns: ["id"]
          },
        ]
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
      workbody_performance_history: {
        Row: {
          action_item_completion: number | null
          attendance_rate: number | null
          average_decision_turnaround: number | null
          created_at: string | null
          cross_workbody_collaborations: number | null
          deliverable_quality_score: number | null
          doc_submission_timeliness: number | null
          id: string
          meetings_held: number | null
          member_turnover: number | null
          period_end: string
          period_start: string
          period_type: string
          recommendations_issued: number | null
          updated_at: string | null
          workbody_id: string | null
        }
        Insert: {
          action_item_completion?: number | null
          attendance_rate?: number | null
          average_decision_turnaround?: number | null
          created_at?: string | null
          cross_workbody_collaborations?: number | null
          deliverable_quality_score?: number | null
          doc_submission_timeliness?: number | null
          id?: string
          meetings_held?: number | null
          member_turnover?: number | null
          period_end: string
          period_start: string
          period_type: string
          recommendations_issued?: number | null
          updated_at?: string | null
          workbody_id?: string | null
        }
        Update: {
          action_item_completion?: number | null
          attendance_rate?: number | null
          average_decision_turnaround?: number | null
          created_at?: string | null
          cross_workbody_collaborations?: number | null
          deliverable_quality_score?: number | null
          doc_submission_timeliness?: number | null
          id?: string
          meetings_held?: number | null
          member_turnover?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          recommendations_issued?: number | null
          updated_at?: string | null
          workbody_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workbody_performance_history_workbody_id_fkey"
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
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
