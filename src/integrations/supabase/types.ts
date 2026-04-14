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
          battle_puzzles: Json | null
          created_at: string
          creator_answers: Json | null
          creator_id: string
          creator_score: Json | null
          creator_time: number | null
          current_round: number | null
          custom_settings: Json | null
          finished_at: string | null
          game_mode: string
          id: string
          max_time_seconds: number
          opponent_answers: Json | null
          opponent_id: string | null
          opponent_score: Json | null
          opponent_time: number | null
          penalty_seconds: number
          point_system: string
          realtime_mode: boolean
          rounds: number
          started_at: string | null
          status: string
          winner_id: string | null
        }
        Insert: {
          allow_penalties?: boolean
          battle_puzzles?: Json | null
          created_at?: string
          creator_answers?: Json | null
          creator_id: string
          creator_score?: Json | null
          creator_time?: number | null
          current_round?: number | null
          custom_settings?: Json | null
          finished_at?: string | null
          game_mode?: string
          id?: string
          max_time_seconds?: number
          opponent_answers?: Json | null
          opponent_id?: string | null
          opponent_score?: Json | null
          opponent_time?: number | null
          penalty_seconds?: number
          point_system?: string
          realtime_mode?: boolean
          rounds?: number
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Update: {
          allow_penalties?: boolean
          battle_puzzles?: Json | null
          created_at?: string
          creator_answers?: Json | null
          creator_id?: string
          creator_score?: Json | null
          creator_time?: number | null
          current_round?: number | null
          custom_settings?: Json | null
          finished_at?: string | null
          game_mode?: string
          id?: string
          max_time_seconds?: number
          opponent_answers?: Json | null
          opponent_id?: string | null
          opponent_score?: Json | null
          opponent_time?: number | null
          penalty_seconds?: number
          point_system?: string
          realtime_mode?: boolean
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
      community_puzzles: {
        Row: {
          answer: string
          category: string
          created_at: string
          created_by: string
          difficulty: string
          id: string
          likes: number
          plays: number
          question: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          created_by: string
          difficulty?: string
          id?: string
          likes?: number
          plays?: number
          question: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          created_by?: string
          difficulty?: string
          id?: string
          likes?: number
          plays?: number
          question?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
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
      lobbies: {
        Row: {
          allow_penalties: boolean
          created_at: string
          creator_id: string
          finished_at: string | null
          game_mode: string
          id: string
          lobby_puzzles: Json | null
          max_players: number
          max_time_seconds: number
          name: string
          penalty_seconds: number
          point_system: string
          rounds: number
          started_at: string | null
          status: string
        }
        Insert: {
          allow_penalties?: boolean
          created_at?: string
          creator_id: string
          finished_at?: string | null
          game_mode?: string
          id?: string
          lobby_puzzles?: Json | null
          max_players?: number
          max_time_seconds?: number
          name?: string
          penalty_seconds?: number
          point_system?: string
          rounds?: number
          started_at?: string | null
          status?: string
        }
        Update: {
          allow_penalties?: boolean
          created_at?: string
          creator_id?: string
          finished_at?: string | null
          game_mode?: string
          id?: string
          lobby_puzzles?: Json | null
          max_players?: number
          max_time_seconds?: number
          name?: string
          penalty_seconds?: number
          point_system?: string
          rounds?: number
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      lobby_daily_usage: {
        Row: {
          id: string
          lobbies_created: number
          lobbies_joined: number
          usage_date: string
          user_id: string
        }
        Insert: {
          id?: string
          lobbies_created?: number
          lobbies_joined?: number
          usage_date?: string
          user_id: string
        }
        Update: {
          id?: string
          lobbies_created?: number
          lobbies_joined?: number
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      lobby_participants: {
        Row: {
          answers: Json | null
          finished: boolean
          id: string
          joined_at: string
          lobby_id: string
          score: Json | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          finished?: boolean
          id?: string
          joined_at?: string
          lobby_id: string
          score?: Json | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          finished?: boolean
          id?: string
          joined_at?: string
          lobby_id?: string
          score?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lobby_participants_lobby_id_fkey"
            columns: ["lobby_id"]
            isOneToOne: false
            referencedRelation: "lobbies"
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
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
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
      puzzle_submissions: {
        Row: {
          answer: string
          category: string
          created_at: string
          difficulty: string
          id: string
          question: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string
          submitted_by: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          question: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_by: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          question?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_by?: string
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      user_settings: {
        Row: {
          created_at: string
          email_notifications_enabled: boolean
          id: string
          notifications_enabled: boolean
          notify_battle_invites: boolean
          notify_credits: boolean
          notify_friend_requests: boolean
          sound_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications_enabled?: boolean
          id?: string
          notifications_enabled?: boolean
          notify_battle_invites?: boolean
          notify_credits?: boolean
          notify_friend_requests?: boolean
          sound_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications_enabled?: boolean
          id?: string
          notifications_enabled?: boolean
          notify_battle_invites?: boolean
          notify_credits?: boolean
          notify_friend_requests?: boolean
          sound_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          current_streak: number | null
          is_pro: boolean | null
          user_id: string | null
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          current_streak?: number | null
          is_pro?: boolean | null
          user_id?: string | null
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
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
      create_notification_if_enabled: {
        Args: {
          _body: string
          _data?: Json
          _title: string
          _type: string
          _user_id: string
        }
        Returns: undefined
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      update_profile_safe: {
        Args: { _avatar_url?: string; _bio?: string; _username?: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
      friend_status: ["pending", "accepted", "rejected", "blocked"],
    },
  },
} as const
