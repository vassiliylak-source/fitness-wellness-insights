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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      daily_tips: {
        Row: {
          created_at: string
          id: string
          tip_date: string
          tip_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          tip_date: string
          tip_text: string
        }
        Update: {
          created_at?: string
          id?: string
          tip_date?: string
          tip_text?: string
        }
        Relationships: []
      }
      weekly_challenge_participations: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          display_name: string | null
          id: string
          progress: number
          session_id: string
          target: number
          updated_at: string
          user_id: string
          week_number: number
          year: number
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          progress?: number
          session_id: string
          target: number
          updated_at?: string
          user_id: string
          week_number: number
          year: number
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          progress?: number
          session_id?: string
          target?: number
          updated_at?: string
          user_id?: string
          week_number?: number
          year?: number
        }
        Relationships: []
      }
      workout_global_stats: {
        Row: {
          average_time: number
          fastest_time: number | null
          id: string
          total_completions: number
          updated_at: string
          workout_hash: string
        }
        Insert: {
          average_time?: number
          fastest_time?: number | null
          id?: string
          total_completions?: number
          updated_at?: string
          workout_hash: string
        }
        Update: {
          average_time?: number
          fastest_time?: number | null
          id?: string
          total_completions?: number
          updated_at?: string
          workout_hash?: string
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          actual_time: number | null
          completed_at: string
          created_at: string
          difficulty_rating: number | null
          exercises: Json
          feeling: string | null
          id: string
          package_type: string
          session_id: string
          target_time: number
          user_id: string
          workout_hash: string
        }
        Insert: {
          actual_time?: number | null
          completed_at?: string
          created_at?: string
          difficulty_rating?: number | null
          exercises: Json
          feeling?: string | null
          id?: string
          package_type: string
          session_id: string
          target_time: number
          user_id: string
          workout_hash: string
        }
        Update: {
          actual_time?: number | null
          completed_at?: string
          created_at?: string
          difficulty_rating?: number | null
          exercises?: Json
          feeling?: string | null
          id?: string
          package_type?: string
          session_id?: string
          target_time?: number
          user_id?: string
          workout_hash?: string
        }
        Relationships: []
      }
      workout_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_workout_date: string | null
          longest_streak: number
          session_id: string
          total_workouts: number
          unlocked_features: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_workout_date?: string | null
          longest_streak?: number
          session_id: string
          total_workouts?: number
          unlocked_features?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_workout_date?: string | null
          longest_streak?: number
          session_id?: string
          total_workouts?: number
          unlocked_features?: Json
          updated_at?: string
          user_id?: string
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
