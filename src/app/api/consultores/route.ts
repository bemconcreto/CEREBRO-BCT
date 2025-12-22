import { NextResponse } from "next/server";
import { supabaseConsultor } from "@/lib/supabaseConsultor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: consultores, error } = await supabaseConsultor
      .from("Corretor")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    if (!consultores || consultores.length === 0) {
      return NextResponse.json([]);
    }

    const userIds = consultores.map(c => c.userId).filter(Boolean);

    const { data: users, error: uError } = await supabaseConsultor
      .from("User")
      .select("id, name, email")
      .in("id", userIds);

    if (uError) throw uError;

    const resultado = consultores.map(c => {
      const user = users?.find(u => u.id === c.userId);
      return {
        ...c,
        nome: user?.name ?? null,
        email: user?.email ?? null,
      };
    });

    return NextResponse.json(resultado);
  } catch (err) {
    console.error("Erro Consultores:", err);
    return NextResponse.json({ error: "Erro ao buscar consultores" }, { status: 500 });
  }
}