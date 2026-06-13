import { createBrowserClient } from "@supabase/ssr";

// createBrowserClient (em vez de createClient) guarda a sessão em cookies,
// para que o middleware (server-side) consiga validar o login do dashboard.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);