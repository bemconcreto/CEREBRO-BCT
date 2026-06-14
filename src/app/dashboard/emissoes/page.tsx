"use client";

import { useEffect, useState } from "react";
import { Coins, Wallet, Layers, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Overview = {
  faturamentoTotal: number;
};

export default function EmissoesPage() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const format = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const faturamento = data?.faturamentoTotal || 0;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Emissões do BEM</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Gestão das emissões de token vinculadas à holding
        </p>
      </div>

      {/* CARDS DE TOPO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Coins} title="Emissão Atual" value="1ª Emissão" sub="10.000.000 BEM" />

        <KpiCard
          icon={Wallet}
          title="Capital Captado"
          value={data ? format(faturamento) : "—"}
          sub="faturamento total"
        />

        <KpiCard icon={Layers} title="Supply Total Emitido" value="10.000.000 BEM" sub="de 1T final" />

        <KpiCard icon={PieChart} title="Diluição Atual" value="0,001%" sub="controlada" />
      </div>

      {/* TABELA DE EMISSÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Emissões</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Emissão</TableHead>
                <TableHead>Supply</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Captado</TableHead>
                <TableHead>Vendido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <Linha
                emissao="1ª Emissão"
                supply="10.000.000"
                preco="R$ 0,50"
                captado={data ? format(faturamento) : "—"}
                vendido="—"
                status="Ativa"
              />

              <Linha
                emissao="2ª Emissão"
                supply="100.000.000"
                preco="—"
                captado="—"
                vendido="0%"
                status="Bloqueada"
              />

              <Linha
                emissao="3ª Emissão"
                supply="1.000.000.000"
                preco="—"
                captado="—"
                vendido="—"
                status="Futura"
              />

              <Linha
                emissao="4ª Emissão"
                supply="10.000.000.000"
                preco="—"
                captado="—"
                vendido="—"
                status="Futura"
              />

              <Linha
                emissao="5ª Emissão"
                supply="100.000.000.000"
                preco="—"
                captado="—"
                vendido="—"
                status="Futura"
              />

              <Linha
                emissao="6ª Emissão"
                supply="1.000.000.000.000"
                preco="—"
                captado="—"
                vendido="—"
                status="Final"
              />
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* COMPONENTES AUXILIARES */

function KpiCard({
  icon: Icon,
  title,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  sub?: string;
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
          {sub && <p className="text-xs text-[#9CA3AF] truncate">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function Linha({
  emissao,
  supply,
  preco,
  captado,
  vendido,
  status,
}: {
  emissao: string;
  supply: string;
  preco: string;
  captado: string;
  vendido: string;
  status: string;
}) {
  const statusClass =
    status === "Ativa"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Bloqueada"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-muted text-muted-foreground border-transparent";

  return (
    <TableRow>
      <TableCell className="font-medium text-[#101820]">{emissao}</TableCell>
      <TableCell>{supply}</TableCell>
      <TableCell>{preco}</TableCell>
      <TableCell>{captado}</TableCell>
      <TableCell>{vendido}</TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("font-medium", statusClass)}>
          {status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">Ver</Button>
      </TableCell>
    </TableRow>
  );
}
