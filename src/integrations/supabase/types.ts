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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      battles: {
        Row: {
          allow_penalties: boolean
          created_at: string
          creator_id: string
          creator_score: Json | null
          custom_settings: Json | null
          finished_at: string | null
          game_mode: string
          id: string
          max_time_seconds: number
          opponent_id: string | null
          opponent_score: Json | null
          penalty_seconds: number
          point_system: string
          rounds: number
          started_at: string | null
          status: string
          winner_id: string | null
        }
        Insert: {
          allow_penalties?: boolean
          created_at?: string
          creator_id: string
          creator_score?: Json | null
          custom_settings?: Json | null
          finished_at?: string | null
          game_mode?: string
          id?: string
          max_time_seconds?: number
          opponent_id?: string | null
          opponent_score?: Json | null
          penalty_seconds?: number
          point_system?: string
          rounds?: number
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Update: {
          allow_penalties?: boolean
          created_at?: string
          creator_id?: string
          creator_score?: Json | null
          custom_settings?: Json | null
          finished_at?: string | null
          game_mode?: string
          id?: string
          max_time_seconds?: number
          opponent_id?: string | null
          opponent_score?: Json | null
          penalty_seconds?: number
          point_system?: string
          rounds?: number
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      challenge_progress: {
        Row: {
          created_at: string
          id: string
          penalties: number
          puzzle_date: string
          puzzle_id: string
          task_number: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          penalties?: number
          puzzle_date?: string
          puzzle_id: string
          task_number: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          penalties?: number
          puzzle_date?: string
          puzzle_id?: string
          task_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_progress_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["friend_status"]
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: Database["public"]["Enums"]["friend_status"]
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friend_status"]
          updated_at?: string
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          completed_date: string
          created_at: string
          id: string
          puzzle_id: string
          time_taken: number
          user_id: string
        }
        Insert: {
          completed_date?: string
          created_at?: string
          id?: string
          puzzle_id: string
          time_taken: number
          user_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string
          id?: string
          puzzle_id?: string
          time_taken?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          battle_invite_id: string | null
          content: string
          created_at: string
          id: string
          message_type: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          battle_invite_id?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          battle_invite_id?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          credits: number
          current_streak: number
          daily_retries_used: number
          id: string
          is_pro: boolean
          last_completed_date: string | null
          updated_at: string
          user_id: string
          username: string | null
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          credits?: number
          current_streak?: number
          daily_retries_used?: number
          id?: string
          is_pro?: boolean
          last_completed_date?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          credits?: number
          current_streak?: number
          daily_retries_used?: number
          id?: string
          is_pro?: boolean
          last_completed_date?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          xp?: number
        }
        Relationships: []
      }
      puzzles: {
        Row: {
          answer: string
          created_at: string
          difficulty: string
          id: string
          puzzle_date: string
          question: string
          task_number: number
        }
        Insert: {
          answer: string
          created_at?: string
          difficulty?: string
          id?: string
          puzzle_date: string
          question: string
          task_number?: number
        }
        Update: {
          answer?: string
          created_at?: string
          difficulty?: string
          id?: string
          puzzle_date?: string
          question?: string
          task_number?: number
        }
        Relationships: []
      }
      user_inventory: {
        Row: {
          id: string
          item_id: string
          item_type: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          item_type?: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          item_type?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          current_streak: number | null
          is_pro: boolean | null
          user_id: string | null
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          current_streak?: number | null
          is_pro?: boolean | null
          user_id?: string | null
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          current_streak?: number | null
          is_pro?: boolean | null
          user_id?: string | null
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      puzzles_public: {
        Row: {
          created_at: string | null
          difficulty: string | null
          id: string | null
          puzzle_date: string | null
          question: string | null
          task_number: number | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: string | null
          id?: string | null
          puzzle_date?: string | null
          question?: string | null
          task_number?: number | null
        }
        Update: {
          created_at?: string | null
          difficulty?: string | null
          id?: string | null
          puzzle_date?: string | null
          question?: string | null
          task_number?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      update_profile_safe: {
        Args: { _avatar_url?: string; _bio?: string; _username?: string }
        Returns: undefined
      }
    }
    Enums: {
      friend_status: "pending" | "accepted" | "rejected" | "blocked"
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
      friend_status: ["pending", "accepted", "rejected", "blocked"],
    },
  },
} as const
