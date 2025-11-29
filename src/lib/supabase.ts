import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Some features may not work.')
}

// Use placeholder values if env vars are not set to prevent crashes
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-key'

export { createClient }
export const supabase = createClient(url, key)
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export type User = {
  id: string
  email: string
  created_at: string
}

export type UserProfile = {
  id: string
  user_id: string
  full_name: string
  preferred_name?: string
  dob: string
  gender?: string
  system: 'chaldean' | 'pythagorean'
  preserve_masters: boolean
  last_calculation?: any
  created_at: string
  updated_at: string
}