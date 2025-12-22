"use client";

import { useEffect, useState } from "react";
import Card from "../Card";

type Overview = {
  faturamentoTotal: number;
};

export default function HoldingFinanceCards() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return null;

  const faturamento = data.faturamentoTotal;

  // ===== REGRAS DEFINIDAS POR VOCÊ =====
  const custoFinanceiro = faturamento * 0.03; // 3%
  const lucroLiquido = faturamento * 0.06; // 6%
  const marketing = faturamento * 0.03; // 3%
  const operacional = faturamento * 0.04; // 4%
  const comissao = faturamento * 0.04; // 4%

  const format = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <section>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Financeiro Consolidado
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        <Card
          title="Faturamento Total"
          value={format(faturamento)}
          highlight
        />

        <Card
          title="Custo Financeiro (3%)"
          value={format(custoFinanceiro)}
        />

        <Card
          title="Lucro Líquido (6%)"
          value={format(lucroLiquido)}
        />

        <Card
          title="Marketing (3%)"
          value={format(marketing)}
        />

        <Card
          title="Operacional (4%)"
          value={format(operacional)}
        />

        <Card
          title="Comissão (4%)"
          value={format(comissao)}
        />
      </div>
    </section>
  );
}