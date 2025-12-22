import { NextResponse } from "../../../../../touch .gitignore/node_modules/next/server";
import { supabaseApp } from "@/lib/supabaseApp";

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

    const vendas = data ?? [];

    // Apenas vendas pagas
    const vendasPagas = vendas.filter(v => v.status === "paid");

    // KPIs
    const faturamentoTotal = vendasPagas.reduce(
      (sum, v) => sum + Number(v.valor_pago || 0),
      0
    );

    const totalVendas = vendasPagas.length;

    const bctVendidos = vendasPagas.reduce(
      (sum, v) => sum + Number(v.tokens || 0),
      0
    );

    // Vendas do mês
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    const vendasMes = vendasPagas
      .filter(v => new Date(v.created_at) >= inicioMes)
      .reduce((sum, v) => sum + Number(v.valor_pago || 0), 0);

    // Ticket médio
    const ticketMedio =
      totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

    return NextResponse.json({
      kpis: {
        faturamento_total: faturamentoTotal,
        total_vendas: totalVendas,
        bct_vendidos: bctVendidos,
        vendas_mes: vendasMes,
        ticket_medio: ticketMedio,
      },
      vendas,
    });

  } catch (err) {
    console.error("Erro Vendas:", err);
    return NextResponse.json(
      { error: "Erro ao buscar vendas" },
      { status: 500 }
    );
  }
}
