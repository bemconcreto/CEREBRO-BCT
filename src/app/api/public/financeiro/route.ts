import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabaseApp";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    /* ── Faturamento real (compras pagas) ── */
    const { data: compras, error } = await supabaseApp
      .from("compras_bct")
      .select("valor_pago, status");

    if (error) throw error;

    const pagas = (compras ?? []).filter((c) => c.status === "paid");
    const faturamentoTotal = pagas.reduce(
      (sum, c) => sum + Number(c.valor_pago || 0),
      0
    );
    const totalCompras = pagas.length;

    /* ── Pools (regra BCT) ── */
    const poolReserva   = faturamentoTotal * 0.20;
    const poolLiquidez  = faturamentoTotal * 0.30;
    const poolImoveis   = faturamentoTotal * 0.30;
    const poolCustos    = faturamentoTotal * 0.20;

    /* ── Imóveis (Prisma) ── */
    const imoveis = await prisma.imovel.findMany({
      where: { status: "ativo" },
      select: { valorCompra: true, valorMercado: true },
    });

    const valorInvestidoImoveis = imoveis.reduce(
      (sum, i) => sum + Number(i.valorCompra || 0),
      0
    );
    const valorMercadoImoveis = imoveis.reduce(
      (sum, i) => sum + Number(i.valorMercado || 0),
      0
    );
    const rentabilidadePercentual =
      valorInvestidoImoveis > 0
        ? ((valorMercadoImoveis - valorInvestidoImoveis) / valorInvestidoImoveis) * 100
        : 0;
    const totalImoveis = imoveis.length;

    return NextResponse.json({
      atualizadoEm: new Date().toISOString(),
      faturamentoTotal,
      totalCompras,
      pools: {
        reserva:  { percentual: 20, valor: poolReserva },
        liquidez: { percentual: 30, valor: poolLiquidez },
        imoveis:  { percentual: 30, valor: poolImoveis },
        custos:   { percentual: 20, valor: poolCustos },
      },
      imoveis: {
        total: totalImoveis,
        valorInvestido: valorInvestidoImoveis,
        valorMercado:   valorMercadoImoveis,
        rentabilidade:  rentabilidadePercentual,
      },
    });
  } catch (err) {
    console.error("❌ PUBLIC FINANCEIRO ERROR:", err);
    return NextResponse.json(
      { error: "Erro ao buscar dados financeiros" },
      { status: 500 }
    );
  }
}
