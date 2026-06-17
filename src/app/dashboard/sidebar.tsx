"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  Building2,
  Home,
  TrendingUp,
  Users,
  UserCheck,
  ShoppingCart,
  ArrowDownToLine,
  Hexagon,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Preço do BEM", href: "/dashboard/preco", icon: Coins },
  { name: "Holding", href: "/dashboard/holding", icon: Building2 },
  { name: "Imóveis", href: "/dashboard/imoveis", icon: Home },
  { name: "Emissões", href: "/dashboard/emissoes", icon: TrendingUp },
  { name: "Usuários", href: "/dashboard/usuarios", icon: Users },
  { name: "Consultores", href: "/dashboard/consultores", icon: UserCheck },
  { name: "Vendas", href: "/dashboard/vendas", icon: ShoppingCart },
  { name: "Comissões", href: "/dashboard/comissoes", icon: Banknote },
  { name: "Saques BEM", href: "/dashboard/saques", icon: ArrowDownToLine },
  { name: "Token BEM", href: "/dashboard/token", icon: Hexagon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-[#101820] flex flex-col px-4 py-6">
      {/* LOGO */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          <img src="/logo-bct.png" alt="Bem Concreto" className="w-7 h-7 object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[15px] text-white leading-tight tracking-tight">
            Cérebro BEM
          </span>
          <span className="text-[9px] font-bold text-[#CBA35C] uppercase tracking-[0.2em] leading-none mt-0.5">
            Admin
          </span>
        </div>
      </Link>

      {/* MENU */}
      <nav className="flex flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                active
                  ? "bg-[#8D6E63]/15 text-[#CBA35C]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
