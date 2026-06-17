import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabase-app";
import { transferTokens } from "@/lib/bem-chain";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });

    const { data: saque, error } = await supabaseApp
      .from("withdrawal_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !saque) {
      return NextResponse.json({ success: false, error: "Saque não encontrado" }, { status: 404 });
    }

    if (saque.status !== "pending") {
      return NextResponse.json({ success: false, error: "Saque já foi processado" }, { status: 400 });
    }

    const txHash = await transferTokens(saque.wallet_address, Number(saque.amount));

    await supabaseApp
      .from("withdrawal_requests")
      .update({ status: "completed", tx_hash: txHash, updated_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ success: true, tx_hash: txHash });
  } catch (err) {
    console.error("Erro ao enviar BEM on-chain:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
