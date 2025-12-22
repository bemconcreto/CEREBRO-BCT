import { createClient } from "@supabase/supabase-js";

export const supabaseApp = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_APP_BCT_URL!,
  process.env.SUPABASE_APP_BCT_SERVICE_ROLE_KEY!
);