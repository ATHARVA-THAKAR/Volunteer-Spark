export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      check_ins: {
        Row: {
          comment: string
          created_at: string
          date: string
          flagged: boolean
          id: string
          mood: number
          volunteer_id: string
          volunteer_name: string
          workload: string
        }
        Insert: {
          comment?: string
          created_at?: string
          date?: string
          flagged?: boolean
          id?: string
          mood: number
          volunteer_id: string
          volunteer_name: string
          workload: string
        }
        Update: {
          comment?: string
          created_at?: string
          date?: string
          flagged?: boolean
          id?: string
          mood?: number
          volunteer_id?: string
          volunteer_name?: string
          workload?: string
        }
        Relationships: []
      }
      participation_data: {
        Row: {
          id: string
          month: string
          rate: number
        }
        Insert: {
          id?: string
          month: string
          rate: number
        }
        Update: {
          id?: string
          month?: string
          rate?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      task_feedback: {
        Row: {
          created_at: string
          difficulty: number
          id: string
          improvements: string
          satisfaction: number
          support_needed: string
          task_name: string
          volunteer_id: string
          volunteer_name: string
          would_do_again: boolean
        }
        Insert: {
          created_at?: string
          difficulty: number
          id?: string
          improvements?: string
          satisfaction: number
          support_needed?: string
          task_name: string
          volunteer_id: string
          volunteer_name: string
          would_do_again?: boolean
        }
        Update: {
          created_at?: string
          difficulty?: number
          id?: string
          improvements?: string
          satisfaction?: number
          support_needed?: string
          task_name?: string
          volunteer_id?: string
          volunteer_name?: string
          would_do_again?: boolean
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string
          assigned_to_name: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          status: string
          title: string
        }
        Insert: {
          assigned_to: string
          assigned_to_name?: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          status?: string
          title: string
        }
        Update: {
          assigned_to?: string
          assigned_to_name?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          avatar: string
          burnout_risk: string
          check_in_streak: number
          created_at: string
          email: string
          feedback: string[]
          id: string
          join_date: string
          last_active: string
          morale_score: number
          name: string
          participation_rate: number
          role: string
          tasks_assigned: number
          tasks_completed: number
          weekly_hours: number
        }
        Insert: {
          avatar?: string
          burnout_risk?: string
          check_in_streak?: number
          created_at?: string
          email: string
          feedback?: string[]
          id?: string
          join_date?: string
          last_active?: string
          morale_score?: number
          name: string
          participation_rate?: number
          role: string
          tasks_assigned?: number
          tasks_completed?: number
          weekly_hours?: number
        }
        Update: {
          avatar?: string
          burnout_risk?: string
          check_in_streak?: number
          created_at?: string
          email?: string
          feedback?: string[]
          id?: string
          join_date?: string
          last_active?: string
          morale_score?: number
          name?: string
          participation_rate?: number
          role?: string
          tasks_assigned?: number
          tasks_completed?: number
          weekly_hours?: number
        }
        Relationships: []
      }
      weekly_morale: {
        Row: {
          average: number
          id: string
          week: string
        }
        Insert: {
          average: number
          id?: string
          week: string
        }
        Update: {
          average?: number
          id?: string
          week?: string
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
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "volunteer"
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
    Enums: {
      app_role: ["admin", "volunteer"],
    },
  },
} as const
