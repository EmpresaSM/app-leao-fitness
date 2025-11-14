import { createClient } from '@supabase/supabase-js';

// Configuração segura com fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criar cliente apenas se as credenciais estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          day: string;
          focus: string;
          exercises: number;
          duration: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day: string;
          focus: string;
          exercises: number;
          duration: string;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          day?: string;
          focus?: string;
          exercises?: number;
          duration?: string;
          completed?: boolean;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked: boolean;
          unlocked_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked?: boolean;
          unlocked_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked?: boolean;
          unlocked_at?: string | null;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          total_points: number;
          level: number;
          trial_days_left: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_points?: number;
          level?: number;
          trial_days_left?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_points?: number;
          level?: number;
          trial_days_left?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
