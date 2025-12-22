import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    /* =========================
       1️⃣ BUSCAR IMÓVEIS
    ========================= */
    const imoveis = await prisma.imovel.findMany({
      where: {
        status: "ativo",
      },
    });

    const totalImoveis = imoveis.length;

    /* =========================
       2️⃣ SOMATÓRIOS
    ========================= */
    const valorInvestido = imoveis.reduce(
      (total, i) => total + Number(i.valorCompra ?? 0),
      0
    );

    const valorMercado = imoveis.reduce(
      (total, i) => total + Number(i.valorMercado ?? 0),
      0
    );

    /* =========================
       3️⃣ RENTABILIDADE
       (mercado - compra)
    ========================= */
    const rentabilidade = valorMercado - valorInvestido;

    /* =========================
       4️⃣ PATRIMÔNIO DA HOLDING
       regra que VOCÊ definiu:
       Reserva (20%)
       + Liquidez (30%)
       + Imóveis
       ⚠️ Como ainda não temos vendas aqui,
       usamos só imóveis por enquanto
    ========================= */
    const patrimonioHolding = valorMercado;

    /* =========================
       5️⃣ % DOS IMÓVEIS NO PATRIMÔNIO
    ========================= */
    const percentualHolding =
      patrimonioHolding > 0
        ? ((valorMercado / patrimonioHolding) * 100).toFixed(2)
        : "0";

    /* =========================
       6️⃣ RESPOSTA FINAL
    ========================= */
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