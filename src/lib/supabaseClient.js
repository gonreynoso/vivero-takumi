import { createClient } from '@supabase/supabase-js'

// Cliente único de Supabase. La "publishable key" es segura para usar en el navegador
// (equivalente a la anon key), la seguridad real de escritura se controla con RLS en la base.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
