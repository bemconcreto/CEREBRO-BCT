import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GET — PREÇO ATUAL (ADMIN)
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
      updatedBy: preco.updatedBy,
    });
  } catch (error) {
    console.error("Erro ao buscar preço do BEM:", error);
    return NextResponse.json(
      { error: "Erro ao buscar preço do BEM" },
      { status: 500 }
    );
  }
}

/* =========================
   PUT — ATUALIZAR PREÇO (ADMIN)
========================= */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const precoUsd = Number(body.precoUsd);
    const cotacaoUsdBrl = Number(body.cotacaoUsdBrl);

    if (!precoUsd || !cotacaoUsdBrl || precoUsd <= 0 || cotacaoUsdBrl <= 0) {
      return NextResponse.json(
        { error: "precoUsd e cotacaoUsdBrl são obrigatórios e devem ser positivos" },
        { status: 400 }
      );
    }

    const user = await getSessionUser();

    const atualizado = await prisma.tokenPrice.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        precoUsd,
        cotacaoUsdBrl,
        updatedBy: user?.email ?? null,
      },
      update: {
        precoUsd,
        cotacaoUsdBrl,
        updatedBy: user?.email ?? null,
      },
    });

    return NextResponse.json({
      precoUsd: atualizado.precoUsd,
      cotacaoUsdBrl: atualizado.cotacaoUsdBrl,
      precoBrl: atualizado.precoUsd * atualizado.cotacaoUsdBrl,
      updatedAt: atualizado.updatedAt,
      updatedBy: atualizado.updatedBy,
    });
  } catch (error) {
    console.error("Erro ao atualizar preço do BEM:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar preço do BEM" },
      { status: 500 }
    );
  }
}
