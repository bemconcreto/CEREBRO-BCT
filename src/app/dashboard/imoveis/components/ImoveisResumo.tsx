"use client";

import { useEffect, useState } from "react";
import { Building2, Coins, TrendingUp, LineChart, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ResumoImoveis = {
  totalImoveis: number;
  valorInvestido: number;
  valorMercado: number;
  rentabilidade: number;
  percentualHolding: number;
};

function ResumoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <Card>
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

  const r = resumo ?? {
    totalImoveis: 0,
    valorInvestido: 0,
    valorMercado: 0,
    rentabilidade: 0,
    percentualHolding: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <ResumoCard
        icon={Building2}
        title="Total de Imóveis"
        value={loading ? "—" : String(r.totalImoveis)}
      />

      <ResumoCard
        icon={Coins}
        title="Valor Investido"
        value={loading ? "—" : `R$ ${r.valorInvestido.toLocaleString("pt-BR")}`}
      />

      <ResumoCard
        icon={TrendingUp}
        title="Valor de Mercado"
        value={loading ? "—" : `R$ ${r.valorMercado.toLocaleString("pt-BR")}`}
      />

      <ResumoCard
        icon={LineChart}
        title="Rentabilidade Consolidada"
        value={loading ? "—" : `R$ ${r.rentabilidade.toLocaleString("pt-BR")}`}
      />

      <ResumoCard
        icon={PieChart}
        title="% do Patrimônio da Holding"
        value={loading ? "—" : `${r.percentualHolding.toFixed(2)}%`}
      />
    </div>
  );
}
