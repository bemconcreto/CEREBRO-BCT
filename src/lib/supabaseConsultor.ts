import { createClient } from "@supabase/supabase-js";

export const supabaseConsultor = createClient(
  process.env.SUPABASE_CONSULTOR_URL!,
  process.env.SUPABASE_CONSULTOR_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);