"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, Copy, BadgeCheck, DollarSign, Users, Banknote } from "lucide-react";

interface SaqueComissao {
  id: number;
  valor: number;
  status: "pendente" | "pago";
  createdAt: string;
  dadosBancarios: { chavePix?: string } | null;
  corretor: {
    id: number;
    corretorId: string;
    nome: string | null;
    chavePix: string | null;
    saldoPendente: number;
  } | null;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="ml-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#CBA35C]/10 text-[#CBA35C] text-[11px] font-bold hover:bg-[#CBA35C]/20 transition"
    >
      <Copy className="w-3 h-3" />
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}

export default function ComissoesPage() {
  const [saques, setSaques] = useState<SaqueComissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagandoId, setPagandoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "pendente" | "pago">("todos");

  async function carregar() {
    setLoading(true);
    const res = await fetch("/api/comissoes");
    const json = await res.json();
    setSaques(json.saques ?? []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function marcarPago(id: number, nome: string | null, valor: number) {
    if (!confirm(`Confirma que o PIX de ${fmt(valor)} para ${nome ?? "consultor"} foi enviado?`)) return;
    setPagandoId(id);
    setErro("");
    const res = await fetch("/api/comissoes/pagar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!json.ok) setErro(json.error ?? "Erro ao marcar como pago");
    else await carregar();
    setPagandoId(null);
  }

  const filtrados = saques.filter((s) => filtro === "todos" || s.status === filtro);
  const totalPendente = saques.filter((s) => s.status === "pendente").reduce((a, s) => a + s.valor, 0);
  const totalPago = saques.filter((s) => s.status === "pago").reduce((a, s) => a + s.valor, 0);
  const qtdPendente = saques.filter((s) => s.status === "pendente").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Comissões</h1>
        <p className="text-sm text-[#6B7280] mt-1">Saques de comissão solicitados pelos consultores. Pague via PIX manualmente e marque como pago.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Aguardando pagamento", value: fmt(totalPendente), sub: `${qtdPendente} saque(s) pendente(s)`, icon: Clock, color: "text-amber-500" },
          { label: "Total já pago", value: fmt(totalPago), sub: "comissões liquidadas", icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Total de solicitações", value: saques.length.toString(), sub: "todos os status", icon: Users, color: "text-[#CBA35C]" },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#F7F8F9] border border-[#E5E7EB] flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${k.color}`} />
                </div>
                <span className="text-xs text-[#6B7280] font-medium">{k.label}</span>
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 flex items-start gap-3">
        <Banknote className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">Fluxo de pagamento</p>
          <p className="text-blue-600 text-xs mt-1">
            1. Copie a chave PIX do consultor. &nbsp;2. Faça a transferência no seu banco. &nbsp;3. Clique em "Marcar como pago" para registrar no sistema.
          </p>
        </div>
      </div>

      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
      )}

      {/* Filtros */}
      <div className="flex gap-2">
        {(["todos", "pendente", "pago"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filtro === f
                ? "bg-[#101820] text-white"
                : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#CBA35C] hover:text-[#CBA35C]"
            }`}
          >
            {f === "todos" ? "Todos" : f === "pendente" ? "Pendentes" : "Pagos"}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]/60">
          <h2 className="text-sm font-bold text-[#101820]">Solicitações de saque</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-[#6B7280]">Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#6B7280]">Nenhuma solicitação encontrada.</div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]/60">
            {filtrados.map((s) => {
              const chavePix = s.corretor?.chavePix ?? (s.dadosBancarios as any)?.chavePix;
              const isPago = s.status === "pago";
              return (
                <div key={s.id} className={`px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 ${!isPago ? "bg-amber-50/30" : ""}`}>
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Status + data */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                        isPago
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : "bg-amber-50 border-amber-200 text-amber-600"
                      }`}>
                        {isPago ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isPago ? "Pago" : "Pendente"}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">{fmtDate(s.createdAt)}</span>
                    </div>

                    {/* Nome + código */}
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#101820]">{s.corretor?.nome ?? "Consultor"}</p>
                      {s.corretor?.corretorId && (
                        <span className="px-2 py-0.5 rounded-full bg-[#CBA35C]/10 text-[#CBA35C] text-[10px] font-bold">{s.corretor.corretorId}</span>
                      )}
                    </div>

                    {/* Chave PIX */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#6B7280]">PIX:</span>
                      {chavePix ? (
                        <>
                          <span className="text-xs font-mono font-bold text-[#101820]">{chavePix}</span>
                          <CopyButton text={chavePix} />
                        </>
                      ) : (
                        <span className="text-xs text-red-400 font-semibold">Chave PIX não cadastrada</span>
                      )}
                    </div>

                    {/* Valor */}
                    <p className="text-xl font-extrabold text-[#101820]">{fmt(s.valor)}</p>
                  </div>

                  {/* Ação */}
                  {!isPago && (
                    <button
                      onClick={() => marcarPago(s.id, s.corretor?.nome ?? null, s.valor)}
                      disabled={pagandoId === s.id || !chavePix}
                      className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-bold shadow-md shadow-emerald-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!chavePix ? "Consultor sem chave PIX cadastrada" : ""}
                    >
                      {pagandoId === s.id ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processando...</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Marcar como pago</>
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
