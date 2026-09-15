import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BUCKET = "imoveis-media";
const MAX_SIZE = 15 * 1024 * 1024; // 15MB — documentos (PDF) podem ser maiores que fotos

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tipo = String(formData.get("tipo") ?? "foto"); // "foto" | "documento"
    const slug = String(formData.get("slug") ?? "geral").replace(/[^a-z0-9-]/gi, "");

    if (!file) {
      return NextResponse.json({ ok: false, error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    if (tipo === "foto" && !file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Apenas imagens são aceitas nesse campo" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: "Arquivo muito grande (máx 15MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const fileName = `${tipo}/${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const supabaseUrl = process.env.SUPABASE_APP_URL!;
    const serviceKey = process.env.SUPABASE_APP_SERVICE_ROLE_KEY!;

    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${fileName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: arrayBuffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error("Supabase Storage upload error:", err);
      return NextResponse.json({ ok: false, error: "Erro ao enviar arquivo para o servidor" }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;

    return NextResponse.json({ ok: true, url: publicUrl, nome: file.name });
  } catch (err) {
    console.error("Erro no upload de mídia do imóvel:", err);
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
