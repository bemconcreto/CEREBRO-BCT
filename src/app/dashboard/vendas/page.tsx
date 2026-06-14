"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, UserCheck, Coins, CalendarDays, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Vendas</h1>
        <p className="text-sm text-[#6B7280] mt-1">Controle completo das vendas reais de BCT</p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard icon={DollarSign} title="Faturamento Total" value={formatBRL(kpis?.faturamento_total ?? 0)} />
        <KpiCard icon={ShoppingCart} title="Total de Vendas" value={(kpis?.total_vendas ?? 0).toString()} />
        <KpiCard icon={UserCheck} title="Consultores Ativos" value="—" />
        <KpiCard icon={Coins} title="BCT Vendidos" value={(kpis?.bct_vendidos ?? 0).toLocaleString("pt-BR")} />
        <KpiCard icon={CalendarDays} title="Vendas do Mês" value={formatBRL(kpis?.vendas_mes ?? 0)} />
        <KpiCard icon={Receipt} title="Ticket Médio" value={formatBRL(kpis?.ticket_medio ?? 0)} />
      </div>

      {/* TABELA */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Investidor</TableHead>
                <TableHead>Consultor</TableHead>
                <TableHead>BCT</TableHead>
                <TableHead>Valor (R$)</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
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

              {vendas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    Nenhuma venda encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= COMPONENTES ================= */

function KpiCard({
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
  const statusClass = {
    Pago: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pendente: "bg-amber-50 text-amber-700 border-amber-200",
    Cancelado: "bg-red-50 text-red-700 border-red-200",
  }[status];

  return (
    <TableRow>
      <TableCell>{data}</TableCell>
      <TableCell className="font-medium text-[#101820]">{investidor}</TableCell>
      <TableCell>{consultor}</TableCell>
      <TableCell>{bct}</TableCell>
      <TableCell>{valor}</TableCell>
      <TableCell>{emissao}</TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("font-medium", statusClass)}>
          {status}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
