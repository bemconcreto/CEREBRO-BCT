import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabase-app";
import { transferTokens } from "@/lib/bem-chain";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });

    // Trava a solicitação de forma atômica (evita envio duplicado por duplo
    // clique, retry de rede, ou uso simultâneo do painel admin do APP-BCT
    // sobre a mesma linha de withdrawal_requests).
    const { data: locked, error: lockErr } = await supabaseApp
      .from("withdrawal_requests")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "pending")
      .select("id, amount, wallet_address")
      .single();

    if (lockErr || !locked) {
      return NextResponse.json(
        { success: false, error: "Saque já foi processado ou está sendo processado agora (possivelmente pelo outro painel)." },
        { status: 400 }
      );
    }

    let txHash: string;
    try {
      txHash = await transferTokens(locked.wallet_address, Number(locked.amount));
    } catch (transferErr) {
      // Não reverte para "pending": se a falha ocorreu após a transação já ter
      // sido transmitida (ex: timeout esperando confirmação), reverter permitiria
      // reenvio duplicado. Fica "processing" para checagem manual no Polygonscan.
      console.error("Erro ao enviar BEM on-chain (saque travado em 'processing'):", id, transferErr);
      return NextResponse.json(
        { success: false, error: "Erro ao enviar on-chain. Saque ficou em 'processing' — confira a treasury no Polygonscan antes de tentar de novo." },
        { status: 500 }
      );
    }

    const { error: updateErr } = await supabaseApp
      .from("withdrawal_requests")
      .update({ status: "completed", tx_hash: txHash, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateErr) {
      console.error("CRÍTICO: tx enviada mas falha ao marcar completed:", id, txHash, updateErr);
    }

    return NextResponse.json({ success: true, tx_hash: txHash });
  } catch (err) {
    console.error("Erro ao enviar BEM on-chain:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
