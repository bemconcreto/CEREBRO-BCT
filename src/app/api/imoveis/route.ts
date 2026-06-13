import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeImovel } from "@/lib/normalizeImovel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GET — LISTAR IMÓVEIS
========================= */
export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(imoveis.map(normalizeImovel));
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/* =========================
   POST — CRIAR IMÓVEL
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.nome || !body.localizacao) {
      return NextResponse.json(
        { error: "Nome e localização são obrigatórios" },
        { status: 400 }
      );
    }

    const imovel = await prisma.imovel.create({
      data: {
        holdingId: body.holdingId ?? 1,
        nome: body.nome,
        slug:
          body.slug ??
          body.nome
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, ""),
        localizacao: body.localizacao,
        descricao: body.descricao ?? "",
        valorCompra: Number(body.valorCompra ?? 0),
        valorMercado: Number(body.valorMercado ?? 0),
        percentualPool: Number(body.percentualPool ?? 0),
        status: "ativo",
        imagemUrl: body.imagemUrl ?? null,
        roiProjetado: body.roiProjetado != null ? Number(body.roiProjetado) : null,
        roiRealizado: body.roiRealizado != null ? Number(body.roiRealizado) : null,
        dataAquisicao: body.dataAquisicao ? new Date(body.dataAquisicao) : null,
        statusDocumental: body.statusDocumental ?? null,
        documentos: body.documentos ?? undefined,
      },
    });

    return NextResponse.json(normalizeImovel(imovel));
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao criar imóvel" },
      { status: 500 }
    );
  }
}