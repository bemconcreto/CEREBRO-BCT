"use client";

import { useEffect, useState } from "react";
import Card from "../Card";

type Overview = {
  faturamentoTotal: number;
  poolLiquidez: number;
  poolReserva: number;
  poolImoveis: number;
};

export default function HoldingPools() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return null;

  const format = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <section>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
        Pools Estratégicas
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        <Card
          title="Pool de Imóveis"
          value={`30% • ${format(data.poolImoveis)}`}
          highlight
        />

        <Card
          title="Pool de Liquidez"
          value={`30% • ${format(data.poolLiquidez)}`}
        />

        <Card
          title="Pool de Reserva"
          value={`20% • ${format(data.poolReserva)}`}
        />
      </div>
    </section>
  );
}