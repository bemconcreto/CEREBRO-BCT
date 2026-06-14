"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, UserPlus, CalendarDays, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

/* ================= TYPES ================= */

type WalletSaldo = {
  saldo_tokens: number | null;
};

type Usuario = {
  id: string;
  nome: string;
  cpf?: string | null;
  telefone?: string | null;
  wallet_address?: string | null;
  wallet_saldos?: WalletSaldo[];
  created_at: string;
};

/* ================= PAGE ================= */

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<
    "data_desc" | "data_asc" | "bct_desc" | "bct_asc"
  >("data_desc");

  useEffect(() => {
    fetch("/api/usuarios")
      .then((r) => r.json())
      .then((data) => {
        setUsuarios(Array.isArray(data) ? data : []);
      })
      .catch(() => setUsuarios([]));
  }, []);

  /* ================= FILTRO + ORDENAÇÃO ================= */

  const usuariosFiltrados = useMemo(() => {
    let lista = [...usuarios];

    // 🔍 BUSCA
    if (busca.trim()) {
      const termo = busca.toLowerCase();

      lista = lista.filter((u) =>
        [
          u.nome,
          u.cpf,
          u.telefone,
          u.wallet_address,
        ]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(termo))
      );
    }

    // 🔃 ORDENAÇÃO
    lista.sort((a, b) => {
      const saldoA = a.wallet_saldos?.[0]?.saldo_tokens ?? 0;
      const saldoB = b.wallet_saldos?.[0]?.saldo_tokens ?? 0;

      switch (ordenacao) {
        case "bct_desc":
          return saldoB - saldoA;
        case "bct_asc":
          return saldoA - saldoB;
        case "data_asc":
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        case "data_desc":
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });

    return lista;
  }, [usuarios, busca, ordenacao]);

  /* ================= MÉTRICAS ================= */

  const total = usuariosFiltrados.length;

  const novosMes = usuariosFiltrados.filter((u) => {
    const d = new Date(u.created_at);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const novosSemana = usuariosFiltrados.filter((u) => {
    const d = new Date(u.created_at);
    return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  /* ================= RENDER ================= */

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Usuários</h1>
        <p className="text-sm text-[#6B7280] mt-1">Base real de usuários do App BEM</p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard icon={Users} title="Total de Usuários" value={total.toString()} />
        <KpiCard icon={UserPlus} title="Novos no Mês" value={novosMes.toString()} />
        <KpiCard icon={CalendarDays} title="Novos na Semana" value={novosSemana.toString()} />
      </div>

      {/* BUSCA + ORDENAÇÃO */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-65">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            type="text"
            placeholder="Buscar por nome, CPF, telefone ou carteira…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as typeof ordenacao)}
          className="w-auto"
        >
          <option value="data_desc">Cadastro (mais recentes)</option>
          <option value="data_asc">Cadastro (mais antigos)</option>
          <option value="bct_desc">BEM (maior saldo)</option>
          <option value="bct_asc">BEM (menor saldo)</option>
        </Select>
      </div>

      {/* TABELA */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Carteira</TableHead>
                <TableHead>BEM</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {usuariosFiltrados.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-[#101820]">{u.nome ?? "—"}</TableCell>
                  <TableCell>{u.cpf ?? "—"}</TableCell>
                  <TableCell>{u.telefone ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {u.wallet_address
                      ? `${u.wallet_address.slice(0, 6)}...${u.wallet_address.slice(-4)}`
                      : "—"}
                  </TableCell>
                  <TableCell>{u.wallet_saldos?.[0]?.saldo_tokens ?? 0}</TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}

              {usuariosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    Nenhum usuário encontrado
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

/* ================= CARD ================= */

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
