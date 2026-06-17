import { NextResponse } from "next/server";
import { supabaseConsultor } from "@/lib/supabaseConsultor";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });

    // Buscar o saque
    const { data: saque, error: saqueErr } = await supabaseConsultor
      .from("Saque")
      .select("*, corretor:Corretor(id, saldoPendente)")
      .eq("id", id)
      .single();

    if (saqueErr || !saque) {
      return NextResponse.json({ ok: false, error: "Saque não encontrado" }, { status: 404 });
    }

    if (saque.status !== "pendente") {
      return NextResponse.json({ ok: false, error: "Saque já foi processado" }, { status: 400 });
    }

    // Marcar saque como pago
    const { error: updateSaqueErr } = await supabaseConsultor
      .from("Saque")
      .update({ status: "pago" })
      .eq("id", id);

    if (updateSaqueErr) throw updateSaqueErr;

    // Decrementar saldoPendente do corretor
    const corretorId = saque.corretor?.id ?? saque.corretorId;
    const novoSaldoPendente = Math.max(0, (saque.corretor?.saldoPendente ?? 0) - Number(saque.valor));

    await supabaseConsultor
      .from("Corretor")
      .update({ saldoPendente: novoSaldoPendente })
      .eq("id", corretorId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERRO PAGAR COMISSÃO:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
