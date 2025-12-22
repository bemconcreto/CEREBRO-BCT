import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabaseApp";

export async function GET() {
  const { data, error } = await supabaseApp
    .from("profiles")
    .select(`
      id,
      nome,
      cpf,
      telefone,
      wallet_address,
      created_at,
      wallet_saldos (
        saldo_bct
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro Supabase:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}