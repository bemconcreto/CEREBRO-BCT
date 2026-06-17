import { NextResponse } from "next/server";
import { supabaseApp } from "@/lib/supabase-app";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseApp
      .from("withdrawal_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, saques: data ?? [] });
  } catch (err) {
    console.error("Erro ao buscar saques:", err);
    return NextResponse.json({ success: false, saques: [] }, { status: 500 });
  }
}
