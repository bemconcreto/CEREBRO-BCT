"use client";

import { useEffect, useMemo, useState } from "react";

/* ================= TYPES ================= */

type WalletSaldo = {
  saldo_bct: number | null;
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
      const saldoA = a.wallet_saldos?.[0]?.saldo_bct ?? 0;
      const saldoB = b.wallet_saldos?.[0]?.saldo_bct ?? 0;

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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Usuários</h1>
        <p style={{ fontSize: 14, color: "#666" }}>
          Base real de usuários do App-BCT
        </p>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        <Card title="Total de Usuários" value={total.toString()} />
        <Card title="Novos no Mês" value={novosMes.toString()} />
        <Card title="Novos na Semana" value={novosSemana.toString()} />
      </div>

      {/* BUSCA + ORDENAÇÃO */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nome, CPF, telefone ou carteira…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 1,
            minWidth: 260,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as any)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        >
          <option value="data_desc">Cadastro (mais recentes)</option>
          <option value="data_asc">Cadastro (mais antigos)</option>
          <option value="bct_desc">BCT (maior saldo)</option>
          <option value="bct_asc">BCT (menor saldo)</option>
        </select>
      </div>

      {/* TABELA */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Lista de Usuários
        </h2>

        <table width="100%" cellPadding={10} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                fontSize: 13,
                color: "#666",
                borderBottom: "1px solid #eee",
              }}
            >
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Carteira</th>
              <th>BCT</th>
              <th>Cadastro</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr
                key={u.id}
                style={{
                  fontSize: 14,
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <td><strong>{u.nome ?? "—"}</strong></td>
                <td>{u.cpf ?? "—"}</td>
                <td>{u.telefone ?? "—"}</td>
                <td style={{ fontFamily: "monospace" }}>
                  {u.wallet_address
                    ? `${u.wallet_address.slice(0, 6)}...${u.wallet_address.slice(-4)}`
                    : "—"}
                </td>
                <td>{u.wallet_saldos?.[0]?.saldo_bct ?? 0}</td>
                <td>
                  {new Date(u.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}

            {usuariosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    color: "#999",
                    padding: 20,
                  }}
                >
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      <p style={{ fontSize: 13, color: "#666" }}>{title}</p>
      <h3 style={{ fontSize: 22, fontWeight: 600 }}>{value}</h3>
    </div>
  );
}