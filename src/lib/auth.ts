import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Lê a sessão Supabase a partir dos cookies da requisição (Route Handlers).
 * O middleware já bloqueia requisições sem sessão; este helper serve para
 * obter os dados do usuário logado (ex.: para preencher "updatedBy").
 */
export async function getSessionUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // Route Handlers não precisam renovar cookies aqui;
          // a renovação ocorre no middleware.
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  return data.user;
}
