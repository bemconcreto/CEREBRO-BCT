import { NextResponse } from "next/server";
import { supabaseConsultor } from "@/lib/supabaseConsultor";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseConsultor
      .from("Saque")
      .select(`
        id,
        valor,
        status,
        createdAt,
        dadosBancarios,
        corretor:Corretor (
          id,
          corretorId,
          nome,
          chavePix,
          saldoPendente
        )
      `)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ ok: true, saques: data ?? [] });
  } catch (err) {
    console.error("ERRO BUSCAR COMISSÕES:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
