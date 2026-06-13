import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeImovel } from "@/lib/normalizeImovel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getIdFromUrl(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  return Number(parts[parts.length - 1]);
}

export async function PUT(req: Request) {
  try {
    const id = getIdFromUrl(req);
    const body = await req.json();

    const data: Record<string, any> = {};

    if (body.nome !== undefined) data.nome = body.nome;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.localizacao !== undefined) data.localizacao = body.localizacao;
    if (body.descricao !== undefined) data.descricao = body.descricao;
    if (body.valorCompra !== undefined) data.valorCompra = Number(body.valorCompra);
    if (body.valorMercado !== undefined) data.valorMercado = Number(body.valorMercado);
    if (body.percentualPool !== undefined) data.percentualPool = Number(body.percentualPool);
    if (body.status !== undefined) data.status = body.status;
    if (body.imagemUrl !== undefined) data.imagemUrl = body.imagemUrl;
    if (body.roiProjetado !== undefined)
      data.roiProjetado = body.roiProjetado != null ? Number(body.roiProjetado) : null;
    if (body.roiRealizado !== undefined)
      data.roiRealizado = body.roiRealizado != null ? Number(body.roiRealizado) : null;
    if (body.dataAquisicao !== undefined)
      data.dataAquisicao = body.dataAquisicao ? new Date(body.dataAquisicao) : null;
    if (body.statusDocumental !== undefined) data.statusDocumental = body.statusDocumental;
    if (body.documentos !== undefined) data.documentos = body.documentos;

    const atualizado = await prisma.imovel.update({
      where: { id },
      data,
    });

    return NextResponse.json(normalizeImovel(atualizado));
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar imóvel" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);

    await prisma.imovel.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao excluir imóvel" },
      { status: 500 }
    );
  }
}
