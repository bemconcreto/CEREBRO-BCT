import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabaseApp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseApp
      .from("compras_bct")
      .select(`
        id,
        tokens,
        valor_pago,
        status,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const vendasPagas = (data ?? []).filter(v => v.status === "paid");

    const faturamentoTotal = vendasPagas.reduce(
      (sum, v) => sum + Number(v.valor_pago || 0),
      0
    );

    const totalVendas = vendasPagas.length;
    const bctVendidos = vendasPagas.reduce(
      (sum, v) => sum + Number(v.tokens || 0),
      0
    );

    return NextResponse.json({
      kpis: {
        faturamento_total: faturamentoTotal,
        total_vendas: totalVendas,
        bct_vendidos: bctVendidos,
      },
      vendas: vendasPagas,
    });
  } catch (err) {
    console.error("Erro Vendas:", err);
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 });
  }
}