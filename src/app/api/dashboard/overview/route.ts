import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  try {
    const res = await fetch(
      "https://app.bemconcreto.com/api/financeiro/resumo",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar dados do App-BCT");
    }

    const financeiro = await res.json();

    return NextResponse.json({
      faturamentoTotal: financeiro.faturamentoTotal,
      vendasBCT: financeiro.vendasBCT,

      poolLiquidez: financeiro.poolLiquidez,
      poolReserva: financeiro.poolReserva,
      poolImoveis: financeiro.poolImoveis,

      // enquanto não vem do app
      usuarios: 0,
      consultores: 0,
      totalImoveis: 1,

      valorInvestidoImoveis: 3500000,
      valorMercadoImoveis: 5200000,
      rentabilidadePercentual:
        ((5200000 - 3500000) / 3500000) * 100,
    });
  } catch (error) {
    console.error("❌ OVERVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao montar visão geral" },
      { status: 500 }
    );
  }
}