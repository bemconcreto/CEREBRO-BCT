"use client";

import { useEffect, useMemo, useState } from "react";
import { UserCheck, BadgeCheck, Coins, TrendingUp, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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

type Consultor = {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  status?: string;
  vendas_total?: number;
  qtd_vendas?: number;
  createdAt: string;
};

type Ordenacao =
  | "nome_asc"
  | "nome_desc"
  | "vendas_desc"
  | "cadastro_desc";

export default function ConsultoresPage() {
  const [consultores, setConsultores] = useState<Consultor[]>([]);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("cadastro_desc");

  useEffect(() => {
    fetch("/api/consultores")
      .then((r) => r.json())
      .then((data) => {
        setConsultores(Array.isArray(data) ? data : []);
      });
  }, []);

  /* ===== FILTRO + ORDENAÇÃO ===== */

  const consultoresFiltrados = useMemo(() => {
    let lista = [...consultores];

    // 🔍 BUSCA
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      lista = lista.filter((c) =>
        [c.nome, c.cpf, c.telefone].some((v) =>
          v?.toLowerCase().includes(termo)
        )
      );
    }

    // ↕️ ORDENAÇÃO
    switch (ordenacao) {
      case "nome_asc":
        lista.sort((a, b) => a.nome.localeCompare(b.nome));
        break;

      case "nome_desc":
        lista.sort((a, b) => b.nome.localeCompare(a.nome));
        break;

      case "vendas_desc":
        lista.sort(
          (a, b) => (b.vendas_total ?? 0) - (a.vendas_total ?? 0)
        );
        break;

      case "cadastro_desc":
      default:
        lista.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }

    return lista;
  }, [consultores, busca, ordenacao]);

  /* ===== KPIs ===== */

  const total = consultoresFiltrados.length;

  const certificados = consultoresFiltrados.filter(
    (c) => c.status === "Certificado"
  ).length;

  const vendasTotais = consultoresFiltrados.reduce(
    (sum, c) => sum + (c.vendas_total ?? 0),
    0
  );

  const vendasMes = consultoresFiltrados
    .filter((c) => {
      const d = new Date(c.createdAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, c) => sum + (c.vendas_total ?? 0), 0);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Consultores</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Rede de consultores certificados e desempenho comercial
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={UserCheck} title="Total de Consultores" value={total.toString()} />
        <KpiCard icon={BadgeCheck} title="Certificados" value={certificados.toString()} />
        <KpiCard icon={Coins} title="Vendas Totais (R$)" value={`R$ ${vendasTotais.toLocaleString("pt-BR")}`} />
        <KpiCard icon={TrendingUp} title="Vendas no Mês (R$)" value={`R$ ${vendasMes.toLocaleString("pt-BR")}`} />
      </div>

      {/* TABELA */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Consultores</CardTitle>

          {/* BUSCA + ORDENAÇÃO */}
          <div className="flex gap-3 flex-wrap mt-2">
            <div className="relative flex-1 min-w-65">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                placeholder="Buscar por nome, CPF ou telefone"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
              className="w-auto"
            >
              <option value="cadastro_desc">Mais recentes</option>
              <option value="nome_asc">Nome (A–Z)</option>
              <option value="nome_desc">Nome (Z–A)</option>
              <option value="vendas_desc">Mais vendas</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultor</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vendas (R$)</TableHead>
                <TableHead>Qtd. Vendas</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {consultoresFiltrados.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-[#101820]">{c.nome}</TableCell>
                  <TableCell>{c.cpf ?? "—"}</TableCell>
                  <TableCell>{c.telefone ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        c.status === "Certificado"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {c.status ?? "Pendente"}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {(c.vendas_total ?? 0).toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{c.qtd_vendas ?? 0}</TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}

              {consultoresFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    Nenhum consultor encontrado
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

/* ===== CARD ===== */

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
