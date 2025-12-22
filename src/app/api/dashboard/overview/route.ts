import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabaseApp";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    /* =========================
       1️⃣ VENDAS (FATURAMENTO REAL)
    ========================= */
    const { data: vendas, error } = await supabaseApp
      .from("compras_bct")
      .select("valor_pago, tokens, status");

    if (error) throw error;

    const vendasPagas = (vendas ?? []).filter(
      (v) => v.status === "paid"
    );

    const faturamentoTotal = vendasPagas.reduce(
      (sum, v) => sum + Number(v.valor_pago || 0),
      0
    );

    const vendasBCT = vendasPagas.length;

    /* =========================
       2️⃣ IMÓVEIS (PRISMA)
    ========================= */
    const imoveis = await prisma.imovel.findMany({
      where: { status: "ativo" },
    });

    const totalImoveis = imoveis.length;

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
        ? ((valorMercadoImoveis - valorInvestidoImoveis) /
            valorInvestidoImoveis) *
          100
        : 0;

    /* =========================
       3️⃣ POOLS (REGRA BCT)
    ========================= */
    const poolLiquidez = faturamentoTotal * 0.3;
    const poolReserva = faturamentoTotal * 0.2;
    const poolImoveis = faturamentoTotal * 0.3;

    /* =========================
       4️⃣ RESPOSTA FINAL
    ========================= */
    return NextResponse.json({
      faturamentoTotal,
      vendasBCT,

      poolLiquidez,
      poolReserva,
      poolImoveis,

      totalImoveis,
      valorInvestidoImoveis,
      valorMercadoImoveis,
      rentabilidadePercentual,
    });
  } catch (error) {
    console.error("❌ OVERVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao montar visão geral" },
      { status: 500 }
    );
  }
}