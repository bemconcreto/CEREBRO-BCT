import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      where: { status: "ativo" },
    });

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
    const patrimonioHolding = valorMercado;

    const percentualHolding =
      patrimonioHolding > 0
        ? ((valorMercado / patrimonioHolding) * 100).toFixed(2)
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