import { createClient } from "@supabase/supabase-js";

export const supabaseApp = createClient(
  process.env.SUPABASE_APP_URL!,
  process.env.SUPABASE_APP_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);