"use client";

import { useEffect, useMemo, useState } from "react";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Consultores</h1>
        <p style={{ fontSize: 14, color: "#666" }}>
          Rede de consultores certificados e desempenho comercial
        </p>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Card title="Total de Consultores" value={total.toString()} />
        <Card title="Certificados" value={certificados.toString()} />
        <Card
          title="Vendas Totais (R$)"
          value={`R$ ${vendasTotais.toLocaleString("pt-BR")}`}
        />
        <Card
          title="Vendas no Mês (R$)"
          value={`R$ ${vendasMes.toLocaleString("pt-BR")}`}
        />
      </div>

      {/* TABELA */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
        }}
      >
        {/* BUSCA + ORDENAÇÃO */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Buscar por nome, CPF ou telefone"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              minWidth: 260,
            }}
          />

          <select
            value={ordenacao}
            onChange={(e) =>
              setOrdenacao(e.target.value as Ordenacao)
            }
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          >
            <option value="cadastro_desc">Mais recentes</option>
            <option value="nome_asc">Nome (A–Z)</option>
            <option value="nome_desc">Nome (Z–A)</option>
            <option value="vendas_desc">Mais vendas</option>
          </select>
        </div>

        <table width="100%" cellPadding={10}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 13, color: "#666" }}>
              <th>Consultor</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Vendas (R$)</th>
              <th>Qtd. Vendas</th>
              <th>Cadastro</th>
            </tr>
          </thead>

          <tbody>
            {consultoresFiltrados.map((c) => (
              <tr
                key={c.id}
                style={{ fontSize: 14, borderBottom: "1px solid #eee" }}
              >
                <td><strong>{c.nome}</strong></td>
                <td>{c.cpf ?? "—"}</td>
                <td>{c.telefone ?? "—"}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 500,
                      background:
                        c.status === "Certificado"
                          ? "#EAF6EF"
                          : "#FFF3CD",
                      color:
                        c.status === "Certificado"
                          ? "#2E7D32"
                          : "#856404",
                    }}
                  >
                    {c.status ?? "Pendente"}
                  </span>
                </td>

                <td>
                  R$ {(c.vendas_total ?? 0).toLocaleString("pt-BR")}
                </td>
                <td>{c.qtd_vendas ?? 0}</td>
                <td>
                  {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== CARD ===== */

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