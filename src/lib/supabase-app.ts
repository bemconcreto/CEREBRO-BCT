import { createClient } from "@supabase/supabase-js";

// Cliente apontando para o banco do APP-BCT (investidores)
export const supabaseApp = createClient(
  process.env.SUPABASE_APP_URL!,
  process.env.SUPABASE_APP_SERVICE_ROLE_KEY!
);
