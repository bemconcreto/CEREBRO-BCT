"use client";

import { useEffect, useState } from "react";

type ResumoImoveis = {
  totalImoveis: number;
  valorInvestido: number;
  valorMercado: number;
  rentabilidade: number;
  percentualHolding: number;
};

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        minWidth: 220,
      }}
    >
      <p style={{ fontSize: 13, color: "#6B6B6B" }}>{title}</p>
      <p
        style={{
          marginTop: 8,
          fontSize: 22,
          fontWeight: 600,
          color: "#1E1E1E",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export default function ImoveisResumo() {
  const [resumo, setResumo] = useState<ResumoImoveis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/imoveis/summary")
      .then((res) => res.json())
      .then((data) => {
        setResumo({
          totalImoveis: Number(data.totalImoveis ?? 0),
          valorInvestido: Number(data.valorInvestido ?? 0),
          valorMercado: Number(data.valorMercado ?? 0),
          rentabilidade: Number(data.rentabilidade ?? 0),
          percentualHolding: Number(data.percentualHolding ?? 0),
        });
      })
      .catch(() => {
        setResumo({
          totalImoveis: 0,
          valorInvestido: 0,
          valorMercado: 0,
          rentabilidade: 0,
          percentualHolding: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !resumo) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
        }}
      >
        <Card title="Total de Imóveis" value="—" />
        <Card title="Valor Investido" value="—" />
        <Card title="Valor de Mercado" value="—" />
        <Card title="Rentabilidade Consolidada" value="—" />
        <Card title="% do Patrimônio da Holding" value="—" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 24,
      }}
    >
      <Card
        title="Total de Imóveis"
        value={String(resumo.totalImoveis)}
      />

      <Card
        title="Valor Investido"
        value={`R$ ${resumo.valorInvestido.toLocaleString("pt-BR")}`}
      />

      <Card
        title="Valor de Mercado"
        value={`R$ ${resumo.valorMercado.toLocaleString("pt-BR")}`}
      />

      <Card
        title="Rentabilidade Consolidada"
        value={`R$ ${resumo.rentabilidade.toLocaleString("pt-BR")}`}
      />

      <Card
        title="% do Patrimônio da Holding"
        value={`${resumo.percentualHolding.toFixed(2)}%`}
      />
    </div>
  );
}