"use client";

import { useEffect, useState } from "react";

type Preco = {
  precoUsd: number;
  cotacaoUsdBrl: number;
  precoBrl: number;
  updatedAt: string;
  updatedBy: string | null;
};

export default function PrecoPage() {
  const [preco, setPreco] = useState<Preco | null>(null);
  const [precoUsd, setPrecoUsd] = useState(0);
  const [cotacaoUsdBrl, setCotacaoUsdBrl] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/preco")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setPreco(data);
        setPrecoUsd(data.precoUsd);
        setCotacaoUsdBrl(data.cotacaoUsdBrl);
      });
  }, []);

  async function salvar() {
    setSalvando(true);
    setMensagem(null);

    try {
      const res = await fetch("/api/preco", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ precoUsd, cotacaoUsdBrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.error || "Erro ao salvar preço");
        return;
      }

      setPreco(data);
      setMensagem("Preço atualizado com sucesso.");
    } catch {
      setMensagem("Erro ao salvar preço");
    } finally {
      setSalvando(false);
    }
  }

  const precoBrl = precoUsd * cotacaoUsdBrl;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: "#1E1E1E" }}>
          Preço do BEM
        </h1>
        <p style={{ marginTop: 8, color: "#6B6B6B" }}>
          Define o preço do token BEM (BCT) usado em todo o ecossistema
          (APP, Consultor, Landpage e Certificação).
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
        }}
      >
        <Card title="Preço atual (USD)" value={`US$ ${precoUsd.toFixed(2)}`} />
        <Card title="Cotação USD/BRL" value={`R$ ${cotacaoUsdBrl.toFixed(2)}`} />
        <Card title="Preço atual (BRL)" value={`R$ ${precoBrl.toFixed(2)}`} />
      </div>

      <div style={card}>
        <h2 style={title}>Atualizar preço</h2>

        <CampoNumero
          label="Preço do BEM (USD)"
          value={precoUsd}
          onChange={setPrecoUsd}
        />

        <CampoNumero
          label="Cotação USD/BRL"
          value={cotacaoUsdBrl}
          onChange={setCotacaoUsdBrl}
        />

        <p style={{ marginBottom: 16, color: "#6B6B6B", fontSize: 14 }}>
          Preço resultante em BRL:{" "}
          <strong>R$ {precoBrl.toFixed(2)}</strong>
        </p>

        <button style={btnPrimary} onClick={salvar} disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>

        {mensagem && <p style={{ marginTop: 12 }}>{mensagem}</p>}

        {preco && (
          <p style={{ marginTop: 16, color: "#999", fontSize: 13 }}>
            Última atualização: {new Date(preco.updatedAt).toLocaleString("pt-BR")}
            {preco.updatedBy ? ` por ${preco.updatedBy}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        minWidth: 220,
      }}
    >
      <p style={{ fontSize: 13, color: "#6B6B6B" }}>{title}</p>
      <p style={{ marginTop: 8, fontSize: 22, fontWeight: 600, color: "#1E1E1E" }}>
        {value}
      </p>
    </div>
  );
}

function CampoNumero({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>{label}</label>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={input}
      />
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  maxWidth: 480,
};

const title = { fontSize: 18, fontWeight: 600, marginBottom: 16 };

const btnPrimary = {
  padding: "8px 16px",
  background: "#C9A24D",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: 8,
};
