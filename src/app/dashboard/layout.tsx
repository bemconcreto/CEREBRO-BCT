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
    async function check() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      }
    }

    check();
  }, [router]);

  return (
    <>
      <Sidebar />
      <main
        style={{
          marginLeft: 260,
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