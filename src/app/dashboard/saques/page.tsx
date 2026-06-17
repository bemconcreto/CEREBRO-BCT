"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Clock, CheckCircle2, XCircle, Send } from "lucide-react";

interface Saque {
  id: string;
  user_id: string;
  amount: number;
  wallet_address: string;
  status: "pending" | "completed" | "rejected";
  tx_hash: string | null;
  created_at: string;
}

function fmtBEM(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const STATUS_CONFIG = {
  pending:   { label: "Pendente",   icon: Clock,        color: "text-amber-500",  bg: "bg-amber-50 border-amber-200" },
  completed: { label: "Enviado",    icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  rejected:  { label: "Rejeitado",  icon: XCircle,      color: "text-red-500",    bg: "bg-red-50 border-red-200" },
};

export default function SaquesPage() {
  const [saques, setSaques] = useState<Saque[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviandoId, setEnviandoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  async function carregar() {
    setLoading(true);
    const res = await fetch("/api/saques");
    const json = await res.json();
    setSaques(json.saques ?? []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function enviar(id: string, wallet: string, amount: number) {
    if (!confirm(`Confirma envio de ${fmtBEM(amount)} BEM para ${wallet}?`)) return;
    setEnviandoId(id);
    setErro("");
    try {
      const res = await fetch("/api/saques/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!json.success) setErro(json.error ?? "Erro ao enviar");
      else await carregar();
    } catch (e) {
      setErro("Erro interno ao processar envio.");
    }
    setEnviandoId(null);
  }

  const pendentes = saques.filter((s) => s.status === "pending");
  const total = saques.filter((s) => s.status === "completed").reduce((a, s) => a + Number(s.amount), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Saques BEM On-chain</h1>
        <p className="text-sm text-[#6B7280] mt-1">Transferências de BEM do Supabase para carteiras Polygon dos investidores.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pendentes", value: pendentes.length, color: "text-amber-500" },
          { label: "Total de solicitações", value: saques.length, color: "text-[#101820]" },
          { label: "Total enviado (BEM)", value: fmtBEM(total), color: "text-emerald-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-5">
            <p className="text-xs text-[#6B7280] font-medium mb-1">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
      )}

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]/60">
          <h2 className="text-sm font-bold text-[#101820]">Solicitações</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#6B7280]">Carregando...</div>
        ) : saques.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B7280]">Nenhuma solicitação encontrada.</div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]/60">
            {saques.map((s) => {
              const cfg = STATUS_CONFIG[s.status];
              const Icon = cfg.icon;
              return (
                <div key={s.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-[#6B7280]">{fmtDate(s.created_at)}</span>
                    </div>
                    <p className="text-sm font-bold text-[#101820]">
                      {fmtBEM(Number(s.amount))} <span className="text-[#CBA35C]">BEM</span>
                    </p>
                    <p className="text-xs text-[#6B7280] font-mono truncate">{s.wallet_address}</p>
                    <p className="text-[10px] text-[#9CA3AF] truncate">User: {s.user_id}</p>
                    {s.tx_hash && (
                      <a
                        href={`https://polygonscan.com/tx/${s.tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#CBA35C] hover:underline"
                      >
                        Ver no Polygonscan <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {s.status === "pending" && (
                    <button
                      onClick={() => enviar(s.id, s.wallet_address, Number(s.amount))}
                      disabled={enviandoId === s.id}
                      className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CBA35C] to-[#E8C96A] text-[#101820] text-sm font-bold shadow-md shadow-[#CBA35C]/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enviandoId === s.id ? (
                        <><div className="w-4 h-4 border-2 border-[#101820]/30 border-t-[#101820] rounded-full animate-spin" /> Enviando...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Enviar BEM</>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
