"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Coins,
  Users,
  UserCheck,
  Building2,
  BarChart3,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

type Overview = {
  faturamentoTotal: number;
  vendasBCT: number;
  usuarios: number;
  consultores: number;
  totalImoveis: number;

  poolLiquidez: number;
  poolReserva: number;
  poolImoveis: number;

  valorInvestidoImoveis: number;
  valorMercadoImoveis: number;
  rentabilidadePercentual: number;
};

/* ================= PAGE ================= */

export default function DashboardPage() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const currency = (v?: number) =>
    (v ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div>
      {/* TÍTULO */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Visão Geral</h1>
        <p className="text-sm text-[#6B7280] mt-1">Painel administrativo do CÉREBRO-BCT</p>
      </div>

      {/* KPIs */}
      <Grid cols={5}>
        <KpiCard icon={DollarSign} title="Faturamento Total" value={currency(data?.faturamentoTotal)} />
        <KpiCard icon={Coins} title="Vendas de BCT" value={data?.vendasBCT?.toString() || "0"} />
        <KpiCard icon={Users} title="Usuários" value={data?.usuarios?.toString() || "0"} />
        <KpiCard icon={UserCheck} title="Consultores Certificados" value={data?.consultores?.toString() || "0"} />
        <KpiCard icon={Building2} title="Imóveis Cadastrados" value={data?.totalImoveis?.toString() || "0"} />
      </Grid>

      {/* POOLS */}
      <Section title="Pools Financeiros">
        <Grid cols={3}>
          <KpiCard icon={Coins} title="Pool de Liquidez (30%)" value={currency(data?.poolLiquidez)} />
          <KpiCard icon={Coins} title="Pool de Reserva (20%)" value={currency(data?.poolReserva)} />
          <KpiCard icon={Building2} title="Pool de Imóveis (30%)" value={currency(data?.poolImoveis)} />
        </Grid>
      </Section>

      {/* IMÓVEIS */}
      <Section title="Imóveis & Rentabilidade">
        <Grid cols={3}>
          <KpiCard icon={Building2} title="Valor Investido em Imóveis" value={currency(data?.valorInvestidoImoveis)} />
          <KpiCard icon={Building2} title="Valor de Mercado Atual" value={currency(data?.valorMercadoImoveis)} />
          <KpiCard
            icon={TrendingUpIcon}
            title="Rentabilidade Gerada"
            value={data ? `${data.rentabilidadePercentual.toFixed(2)}%` : "0.00%"}
            highlight={!!data && data.rentabilidadePercentual > 0}
          />
        </Grid>
      </Section>

      {/* GRÁFICOS */}
      <Section title="Gráficos">
        <Card>
          <CardContent className="min-h-[260px] flex items-center justify-center text-[#6B7280] gap-2">
            <BarChart3 className="w-5 h-5" />
            Gráficos em tempo real (próximo passo)
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}

/* ================= COMPONENTES ================= */

function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div
      className={cn(
        "grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2",
        cols === 5 && "lg:grid-cols-5",
        cols === 3 && "lg:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-[#101820] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function KpiCard({
  icon: Icon,
  title,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className={cn(highlight && "border-l-4 border-l-emerald-500")}>
      <CardContent className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-2xl font-bold text-[#101820] truncate">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
