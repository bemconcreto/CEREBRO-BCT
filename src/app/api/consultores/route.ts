import { NextResponse } from "next/server";
import { supabaseConsultor } from "@/lib/supabaseConsultor";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1️⃣ Busca os consultores (como já estava funcionando)
    const { data: consultores, error } = await supabaseConsultor
      .from("Corretor")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    if (!consultores || consultores.length === 0) {
      return NextResponse.json([]);
    }

    // 2️⃣ Pega os userIds dos consultores
    const userIds = consultores
      .map((c) => c.userId)
      .filter(Boolean);

    // 3️⃣ Busca nome e email na tabela User
    const { data: users, error: uError } = await supabaseConsultor
      .from("User")
      .select("id, name, email")
      .in("id", userIds);

    if (uError) throw uError;

    // 4️⃣ Merge manual (SEM alterar o resto)
    const resultado = consultores.map((c) => {
      const user = users?.find((u) => u.id === c.userId);

      return {
        ...c,                 // mantém tudo que já funciona
        nome: user?.name ?? null,
        email: user?.email ?? null,
      };
    });

    return NextResponse.json(resultado);
  } catch (err) {
    console.error("Erro Consultores:", err);
    return NextResponse.json(
      { error: "Erro ao buscar consultores" },
      { status: 500 }
    );
  }
}