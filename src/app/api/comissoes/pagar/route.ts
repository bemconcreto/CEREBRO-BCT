import { NextResponse } from "next/server";
import { supabaseConsultor } from "@/lib/supabaseConsultor";

/**
 * SQL PENDENTE (rodar uma vez no SQL Editor do Supabase do CONSULTOR-BCT,
 * projeto pmmdbisorjjpsfjbpqht) — function usada pelo .rpc() abaixo para
 * decrementar saldoPendente do corretor de forma atômica (increment relativo
 * no próprio Postgres, sem race condition de leitura-depois-escrita):
 *
 * CREATE OR REPLACE FUNCTION decrementar_saldo_pendente_corretor(
 *   corretor_id_input integer,
 *   valor_input double precision
 * ) RETURNS void AS $$
 * BEGIN
 *   UPDATE "Corretor"
 *   SET "saldoPendente" = GREATEST(0, "saldoPendente" - valor_input)
 *   WHERE id = corretor_id_input;
 * END;
 * $$ LANGUAGE plpgsql;
 */

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    // Trava atômica: só marca "pago" se ainda estiver "pendente" (mesma técnica
    // de src/app/api/saques/enviar/route.ts). Isso impede que duplo clique ou
    // requisições concorrentes paguem a mesma comissão duas vezes — apenas a
    // primeira chamada a chegar aqui encontra a linha em "pendente" e a atualiza;
    // a segunda não encontra nenhuma linha e falha com segurança.
    const { data: saque, error: updateSaqueErr } = await supabaseConsultor
      .from("Saque")
      .update({ status: "pago" })
      .eq("id", id)
      .eq("status", "pendente")
      .select("id, valor, corretorId")
      .single();

    if (updateSaqueErr || !saque) {
      return NextResponse.json(
        { ok: false, error: "Saque não encontrado ou já foi processado" },
        { status: 400 }
      );
    }

    // Decrementar saldoPendente do corretor de forma atômica via RPC (increment
    // relativo no banco, não leitura-depois-escrita no Node). Requer a function
    // "decrementar_saldo_pendente_corretor" no Supabase do CONSULTOR-BCT
    // (pmmdbisorjjpsfjbpqht) — ver SQL em CLAUDE.md / comentário no repo.
    // Como a trava acima já garante que só uma chamada chega até aqui por saque,
    // não há duplicação mesmo que o decremento falhe isoladamente; o erro fica
    // logado para conferência manual do saldoPendente.
    const { error: decrementErr } = await supabaseConsultor.rpc(
      "decrementar_saldo_pendente_corretor",
      { corretor_id_input: saque.corretorId, valor_input: Number(saque.valor) }
    );

    if (decrementErr) {
      console.error(
        "ERRO ao decrementar saldoPendente do corretor (saque já marcado como pago, id=" + id + "):",
        decrementErr
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERRO PAGAR COMISSÃO:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
