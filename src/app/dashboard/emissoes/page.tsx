"use client";

import { useEffect, useState } from "react";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>
          Emissões do BCT
        </h1>
        <p style={{ color: "#666", fontSize: 14 }}>
          Gestão das emissões de token vinculadas à holding
        </p>
      </div>

      {/* CARDS DE TOPO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Card title="Emissão Atual" value="1ª Emissão" sub="10.000.000 BCT" />

        <Card
          title="Capital Captado"
          value={data ? format(faturamento) : "—"}
          sub="faturamento total"
        />

        <Card
          title="Supply Total Emitido"
          value="10.000.000 BCT"
          sub="de 1T final"
        />

        <Card
          title="Diluição Atual"
          value="0,001%"
          sub="controlada"
        />
      </div>

      {/* TABELA DE EMISSÕES */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,.05)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Histórico de Emissões
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            width="100%"
            cellPadding={10}
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  fontSize: 13,
                  color: "#666",
                  borderBottom: "1px solid #eee",
                }}
              >
                <th>Emissão</th>
                <th>Supply</th>
                <th>Preço</th>
                <th>Captado</th>
                <th>Vendido</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTES AUXILIARES */

function Card({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
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
      <h3 style={{ fontSize: 20, fontWeight: 600 }}>{value}</h3>
      {sub && <p style={{ fontSize: 13, color: "#999" }}>{sub}</p>}
    </div>
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
  const statusColor =
    status === "Ativa"
      ? "#2ECC71"
      : status === "Bloqueada"
      ? "#E67E22"
      : "#999";

  return (
    <tr
      style={{
        fontSize: 14,
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <td><strong>{emissao}</strong></td>
      <td>{supply}</td>
      <td>{preco}</td>
      <td>{captado}</td>
      <td>{vendido}</td>
      <td style={{ color: statusColor, fontWeight: 500 }}>{status}</td>
      <td>
        <button style={acaoBtn}>Ver</button>
      </td>
    </tr>
  );
}

const acaoBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#C9A24D",
  cursor: "pointer",
  fontWeight: 500,
};