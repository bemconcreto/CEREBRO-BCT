import { NextResponse } from "../../../../../../touch .gitignore/node_modules/next/server";
import { prisma } from "@/lib/prisma";

function getIdFromUrl(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  return Number(parts[parts.length - 1]);
}

export async function PUT(req: Request) {
  try {
    const id = getIdFromUrl(req);
    const body = await req.json();

    console.log("🔥 PUT IMOVEL ID:", id);
    console.log("🔥 BODY:", body);

    const atualizado = await prisma.imovel.update({
      where: { id },
      data: {
        nome: body.nome,
        localizacao: body.localizacao,
        descricao: body.descricao,
        valorCompra: Number(body.valorCompra),
        valorMercado: Number(body.valorMercado),
        percentualPool: Number(body.percentualPool),
      },
    });

    console.log("✅ ATUALIZADO NO SUPABASE");

    return NextResponse.json(atualizado);
  } catch (error) {
    console.error("❌ ERRO UPDATE IMOVEL:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar imóvel" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);

    console.log("🗑️ DELETE IMOVEL ID:", id);

    await prisma.imovel.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ ERRO DELETE IMOVEL:", error);
    return NextResponse.json(
      { error: "Erro ao excluir imóvel" },
      { status: 500 }
    );
  }
}