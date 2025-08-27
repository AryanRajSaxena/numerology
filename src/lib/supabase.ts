import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export { createClient }
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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