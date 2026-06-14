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
      <h2 className="text-lg font-semibold text-[#101820] mb-4">Pools Estratégicas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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