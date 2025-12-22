"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Imovel = {
  id: number;
  nome: string;
  localizacao: string;
  descricao: string;
  valorCompra: number;
  valorMercado: number;
  percentualPool: number;
};

/* ================= PAGE ================= */

export default function ImoveisGestao() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [form, setForm] = useState<Imovel | null>(null);

  const [abrirNovo, setAbrirNovo] = useState(false);
  const [editar, setEditar] = useState(false);
  const [confirmarExcluir, setConfirmarExcluir] = useState(false);

  /* ===== LOAD ===== */
useEffect(() => {
  fetch("/api/imoveis")
    .then((r) => r.json())
    .then((data) => {
      setImoveis(Array.isArray(data) ? data : data.imoveis || data.data || []);
    });
}, []);

  /* ===== CREATE ===== */
  async function criarImovel(novo: Omit<Imovel, "id">) {
    const res = await fetch("/api/imoveis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });

    const criado = await res.json();
    setImoveis((prev) => [...prev, criado]);
    setAbrirNovo(false);
  }

  /* ===== DELETE ===== */
  async function excluirImovel() {
    if (!form) return;

    await fetch(`/api/imoveis/${form.id}`, {
      method: "DELETE",
    });

    setImoveis((prev) => prev.filter((i) => i.id !== form.id));
    setConfirmarExcluir(false);
    setForm(null);
  }

  return (
    <div style={card}>
      {/* HEADER */}
      <div style={header}>
        <h2 style={title}>Gestão de Imóveis</h2>
        <button style={btnPrimary} onClick={() => setAbrirNovo(true)}>
          + Novo imóvel
        </button>
      </div>

      {/* TABLE */}
      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={thead}>
            <th>Imóvel</th>
            <th>Localização</th>
            <th>Descrição</th>
            <th>Compra</th>
            <th>Mercado</th>
            <th>% Pool</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {imoveis.map((i) => (
            <tr key={i.id} style={row}>
              <td><strong>{i.nome}</strong></td>
              <td>{i.localizacao}</td>
              <td>{i.descricao}</td>
              <td>R$ {i.valorCompra.toLocaleString("pt-BR")}</td>
              <td>R$ {i.valorMercado.toLocaleString("pt-BR")}</td>
              <td>{i.percentualPool}%</td>
              <td>
                <button
                  style={btnLink}
                  onClick={() => {
                    setForm(i);
                    setEditar(true);
                  }}
                >
                  Editar
                </button>
                <button
                  style={{ ...btnLink, color: "#C0392B" }}
                  onClick={() => {
                    setForm(i);
                    setConfirmarExcluir(true);
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAIS */}
      {abrirNovo && (
        <ModalImovel
          titulo="Novo Imóvel"
          onClose={() => setAbrirNovo(false)}
          onSave={criarImovel}
        />
      )}

      {editar && form && (
        <ModalImovel
          titulo="Editar Imóvel"
          initial={form}
          onClose={() => setEditar(false)}
          onSave={async (data: Omit<Imovel, "id">) => {
            const atualizado: Imovel = { ...form, ...data };

            await fetch(`/api/imoveis/${atualizado.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(atualizado),
            });

            setImoveis((prev) =>
              prev.map((i) => (i.id === atualizado.id ? atualizado : i))
            );

            setEditar(false);
            setForm(null);
          }}
        />
      )}

      {confirmarExcluir && (
        <ConfirmarExcluir
          onCancel={() => setConfirmarExcluir(false)}
          onConfirm={excluirImovel}
        />
      )}
    </div>
  );
}

/* ================= MODAL IMÓVEL ================= */

function ModalImovel({
  titulo,
  initial,
  onClose,
  onSave,
}: {
  titulo: string;
  initial?: Imovel;
  onClose: () => void;
  onSave: (data: Omit<Imovel, "id">) => void;
}) {
  const [data, setData] = useState<Omit<Imovel, "id">>({
    nome: initial?.nome || "",
    localizacao: initial?.localizacao || "",
    descricao: initial?.descricao || "",
    valorCompra: initial?.valorCompra || 0,
    valorMercado: initial?.valorMercado || 0,
    percentualPool: initial?.percentualPool || 0,
  });

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{titulo}</h3>

        <Campo label="Nome" value={data.nome} onChange={(v) => setData({ ...data, nome: v })} />
        <Campo label="Localização" value={data.localizacao} onChange={(v) => setData({ ...data, localizacao: v })} />
        <Campo label="Descrição" value={data.descricao} onChange={(v) => setData({ ...data, descricao: v })} />

        <CampoNumero
          label="Valor de Compra"
          value={data.valorCompra}
          onChange={(v) => setData({ ...data, valorCompra: v })}
        />

        <CampoNumero
          label="Valor de Mercado"
          value={data.valorMercado}
          onChange={(v) => setData({ ...data, valorMercado: v })}
        />

        <CampoNumero
          label="% Pool"
          value={data.percentualPool}
          onChange={(v) => setData({ ...data, percentualPool: v })}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose}>Cancelar</button>
          <button style={btnPrimary} onClick={() => onSave(data)}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= CONFIRM DELETE ================= */

function ConfirmarExcluir({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Confirmar exclusão</h3>
        <p>Tem certeza que deseja excluir este imóvel?</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onCancel}>Cancelar</button>
          <button
            style={{ ...btnPrimary, background: "#C0392B" }}
            onClick={onConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= CAMPOS ================= */

function Campo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={input} />
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={input}
      />
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 24,
};

const title = { fontSize: 18, fontWeight: 600 };

const thead = {
  textAlign: "left" as const,
  fontSize: 13,
  color: "#666",
  borderBottom: "1px solid #eee",
};

const row = {
  fontSize: 14,
  borderBottom: "1px solid #f0f0f0",
};

const btnLink = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#C9A24D",
  marginRight: 8,
};

const btnPrimary = {
  padding: "8px 16px",
  background: "#C9A24D",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 32,
  borderRadius: 16,
  width: 600,
};

const input = {
  width: "100%",
  padding: 8,
};