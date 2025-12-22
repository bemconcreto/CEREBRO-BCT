import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =========================
   GET — LISTAR IMÓVEIS
========================= */
export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 🔒 Normaliza tudo para evitar NaN no frontend
    const normalizados = imoveis.map((i: any) => ({
      id: i.id,
      nome: i.nome,
      localizacao: i.localizacao,
      descricao: i.descricao,
      valorCompra: Number(i.valorCompra ?? 0),
      valorMercado: Number(i.valorMercado ?? 0),
      percentualPool: Number(i.percentualPool ?? 0),
      status: i.status,
      createdAt: i.createdAt,
    }));

    return NextResponse.json(normalizados);
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

    // 🔒 Validação mínima
    if (!body.nome || !body.localizacao) {
      return NextResponse.json(
        { error: "Nome e localização são obrigatórios" },
        { status: 400 }
      );
    }

    const imovel = await prisma.imovel.create({
      data: {
        holdingId: body.holdingId ?? 1, // 🔥 IMPORTANTE
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
      },
    });

    return NextResponse.json(imovel);
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao criar imóvel" },
      { status: 500 }
    );
  }
}