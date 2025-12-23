import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabaseApp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseApp
      .from("cerebro_usuarios")
      .select(`
        id,
        nome,
        cpf,
        telefone,
        wallet_address,
        created_at,
        wallet_saldos ( saldo_tokens )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Erro Usuários:", err);
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
  }
}