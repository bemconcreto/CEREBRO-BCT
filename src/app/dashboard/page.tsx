"use client";

import { useEffect, useState } from "react";

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
    <div style={{ padding: 32 }}>
      {/* TÍTULO */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>Visão Geral</h1>
        <p style={{ color: "#555" }}>
          Painel administrativo do CÉREBRO-BCT
        </p>
      </div>

      {/* KPIs */}
      <Grid>
        <Card
          title="Faturamento Total"
          value={currency(data?.faturamentoTotal)}
        />
        <Card
          title="Vendas de BCT"
          value={data?.vendasBCT?.toString() || "0"}
        />
        <Card
          title="Usuários"
          value={data?.usuarios?.toString() || "0"}
        />
        <Card
          title="Consultores Certificados"
          value={data?.consultores?.toString() || "0"}
        />
        <Card
          title="Imóveis Cadastrados"
          value={data?.totalImoveis?.toString() || "0"}
        />
      </Grid>

      {/* POOLS */}
      <Section title="Pools Financeiros">
        <Grid>
          <Card
            title="Pool de Liquidez (30%)"
            value={currency(data?.poolLiquidez)}
          />
          <Card
            title="Pool de Reserva (20%)"
            value={currency(data?.poolReserva)}
          />
          <Card
            title="Pool de Imóveis (30%)"
            value={currency(data?.poolImoveis)}
          />
        </Grid>
      </Section>

      {/* IMÓVEIS */}
      <Section title="Imóveis & Rentabilidade">
        <Grid>
          <Card
            title="Valor Investido em Imóveis"
            value={currency(data?.valorInvestidoImoveis)}
          />
          <Card
            title="Valor de Mercado Atual"
            value={currency(data?.valorMercadoImoveis)}
          />
          <Card
            title="Rentabilidade Gerada"
            value={
              data
                ? `${data.rentabilidadePercentual.toFixed(2)}%`
                : "0.00%"
            }
            highlight={!!data && data.rentabilidadePercentual > 0}
          />
        </Grid>
      </Section>

      {/* GRÁFICOS */}
      <Section title="Gráficos">
        <div
          style={{
            height: 260,
            background: "#EFECE6",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
          }}
        >
          📊 Gráficos em tempo real (próximo passo)
        </div>
      </Section>
    </div>
  );
}

/* ================= COMPONENTES ================= */

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

function Card({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        borderLeft: highlight ? "4px solid #2ECC71" : "none",
      }}
    >
      <p style={{ fontSize: 14, color: "#777", marginBottom: 8 }}>
        {title}
      </p>
      <strong style={{ fontSize: 20 }}>{value}</strong>
    </div>
  );
}