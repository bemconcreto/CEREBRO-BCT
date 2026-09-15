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

  const format = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#101820] mb-4">Financeiro Consolidado</h2>
      <p className="text-sm text-[#6B7280] mb-4">
        Distribuição oficial do faturamento entre as subcontas (ver detalhamento por
        pool abaixo, em &quot;Pools Estratégicas&quot;).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Faturamento Total" value={format(faturamento)} highlight />
      </div>
    </section>
  );
}
