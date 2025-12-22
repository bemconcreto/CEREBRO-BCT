"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "./sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("two_factor_ok")
        .eq("id", sessionData.session.user.id)
        .single();

      if (!profile?.two_factor_ok) {
        router.replace("/confirmar-codigo");
      }
    }

    checkAccess();
  }, [router]);

  return (
    <>
      <Sidebar />

      <main
        style={{
          marginLeft: 260, // 👈 ESSENCIAL (mantido)
          padding: 32,
          minHeight: "100vh",
          background: "#F6F4EF",
        }}
      >
        {children}
      </main>
    </>
  );
}