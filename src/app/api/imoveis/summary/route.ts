import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [imoveis, holding] = await Promise.all([
      prisma.imovel.findMany({ where: { status: "ativo" } }),
      prisma.holding.findFirst(),
    ]);

    const totalImoveis = imoveis.length;

    const valorInvestido = imoveis.reduce(
      (total: number, i) => total + Number(i.valorCompra ?? 0),
      0
    );

    const valorMercado = imoveis.reduce(
      (total: number, i) => total + Number(i.valorMercado ?? 0),
      0
    );

    const rentabilidade = valorMercado - valorInvestido;
    const patrimonioTotal = Number(holding?.patrimonioTotal ?? 0);

    const percentualHolding =
      patrimonioTotal > 0
        ? ((valorMercado / patrimonioTotal) * 100).toFixed(2)
        : "0";

    return NextResponse.json({
      totalImoveis,
      valorInvestido,
      valorMercado,
      rentabilidade,
      percentualHolding,
    });
  } catch (error) {
    console.error("Erro resumo imóveis:", error);
    return NextResponse.json(
      { error: "Erro ao calcular resumo de imóveis" },
      { status: 500 }
    );
  }
}