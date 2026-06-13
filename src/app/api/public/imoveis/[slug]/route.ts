import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeImovel } from "@/lib/normalizeImovel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSlugFromUrl(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1];
}

/* =========================
   GET — IMÓVEL POR SLUG (PÚBLICO)
========================= */
export async function GET(req: Request) {
  try {
    const slug = getSlugFromUrl(req);

    const imovel = await prisma.imovel.findUnique({ where: { slug } });

    if (!imovel || imovel.status !== "ativo") {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(normalizeImovel(imovel));
  } catch (error) {
    console.error("Erro ao buscar imóvel por slug:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóvel" },
      { status: 500 }
    );
  }
}
