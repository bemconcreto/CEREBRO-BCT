import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabaseApp";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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