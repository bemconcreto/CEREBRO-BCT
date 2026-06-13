import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GET — PREÇO PÚBLICO DO BEM/BCT
========================= */
export async function GET() {
  try {
    const preco = await prisma.tokenPrice.findUnique({ where: { id: 1 } });

    if (!preco) {
      return NextResponse.json(
        { error: "Preço do BEM ainda não foi configurado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      precoUsd: preco.precoUsd,
      cotacaoUsdBrl: preco.cotacaoUsdBrl,
      precoBrl: preco.precoUsd * preco.cotacaoUsdBrl,
      updatedAt: preco.updatedAt,
    });
  } catch (error) {
    console.error("Erro ao buscar preço do BEM:", error);
    return NextResponse.json(
      { error: "Erro ao buscar preço do BEM" },
      { status: 500 }
    );
  }
}
