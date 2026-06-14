"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
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

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8F9]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <header className="flex items-center justify-end px-8 py-4 border-b border-[#E5E7EB] bg-white/60 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-[#6B7280] hover:text-[#101820]"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
