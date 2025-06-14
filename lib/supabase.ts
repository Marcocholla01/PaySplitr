// lib/supabase.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// export function createClient() {
//   return createSupabaseClient(supabaseUrl, supabaseKey)
// }


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => 
  createSupabaseClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  })