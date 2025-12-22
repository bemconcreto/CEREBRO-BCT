"use client";

import { useEffect, useState } from "react";

type Venda = {
  id: string;
  valor_pago: number;
  tokens: number;
  status: "paid" | "pending" | "cancelled";
  created_at: string;
};

type KPIs = {
  faturamento_total: number;
  total_vendas: number;
  bct_vendidos: number;
  vendas_mes: number;
  ticket_medio: number;
};

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);

  useEffect(() => {
    fetch("/api/vendas")
      .then((r) => r.json())
      .then((data) => {
        setVendas(data.vendas ?? []);
        setKpis(data.kpis ?? null);
      });
  }, []);

  const formatBRL = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Vendas</h1>
        <p style={{ fontSize: 14, color: "#666" }}>
          Controle completo das vendas reais de BCT
        </p>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Card
          title="Faturamento Total"
          value={formatBRL(kpis?.faturamento_total ?? 0)}
        />
        <Card
          title="Total de Vendas"
          value={(kpis?.total_vendas ?? 0).toString()}
        />
        <Card title="Consultores Ativos" value="—" />
        <Card
          title="BCT Vendidos"
          value={(kpis?.bct_vendidos ?? 0).toLocaleString("pt-BR")}
        />
        <Card
          title="Vendas do Mês"
          value={formatBRL(kpis?.vendas_mes ?? 0)}
        />
        <Card
          title="Ticket Médio"
          value={formatBRL(kpis?.ticket_medio ?? 0)}
        />
      </div>

      {/* TABELA */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Histórico de Vendas
        </h2>

        <table width="100%" cellPadding={10}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 13, color: "#666" }}>
              <th>Data</th>
              <th>Investidor</th>
              <th>Consultor</th>
              <th>BCT</th>
              <th>Valor (R$)</th>
              <th>Emissão</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {vendas.map((v) => (
              <LinhaVenda
                key={v.id}
                data={new Date(v.created_at).toLocaleDateString("pt-BR")}
                investidor="—"
                consultor="—"
                bct={v.tokens.toLocaleString("pt-BR")}
                valor={formatBRL(v.valor_pago)}
                emissao="1ª Emissão"
                status={
                  v.status === "paid"
                    ? "Pago"
                    : v.status === "pending"
                    ? "Pendente"
                    : "Cancelado"
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= COMPONENTES ================= */

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      <p style={{ fontSize: 13, color: "#666" }}>{title}</p>
      <h3 style={{ fontSize: 22, fontWeight: 600 }}>{value}</h3>
    </div>
  );
}

function LinhaVenda({
  data,
  investidor,
  consultor,
  bct,
  valor,
  emissao,
  status,
}: {
  data: string;
  investidor: string;
  consultor: string;
  bct: string;
  valor: string;
  emissao: string;
  status: "Pago" | "Pendente" | "Cancelado";
}) {
  const statusStyle = {
    Pago: { bg: "#EAF6EF", color: "#2E7D32" },
    Pendente: { bg: "#FFF3CD", color: "#856404" },
    Cancelado: { bg: "#FDECEA", color: "#C0392B" },
  }[status];

  return (
    <tr style={{ fontSize: 14, borderBottom: "1px solid #f0f0f0" }}>
      <td>{data}</td>
      <td><strong>{investidor}</strong></td>
      <td>{consultor}</td>
      <td>{bct}</td>
      <td>{valor}</td>
      <td>{emissao}</td>
      <td>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 12,
            fontSize: 12,
            background: statusStyle.bg,
            color: statusStyle.color,
          }}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}