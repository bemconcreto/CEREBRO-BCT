import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeImovel } from "@/lib/normalizeImovel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GET — LISTAR IMÓVEIS (PÚBLICO)
========================= */
export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      where: { status: "ativo" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(imoveis.map(normalizeImovel));
  } catch (error) {
    console.error("Erro ao buscar imóveis públicos:", error);
    return NextResponse.json([], { status: 500 });
  }
}
