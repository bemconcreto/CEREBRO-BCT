"use client";

import { useEffect, useState } from "react";
import { Coins, Wallet, TrendingUp, AlertTriangle, ExternalLink } from "lucide-react";

interface Tranche {
  numero: number;
  supply: number;
  precoUsd: number;
  gatilho: number | null;
}

interface TokenData {
  contrato: string;
  owner: string;
  totalMintado: number;
  treasury: { address: string; balance: number };
  trancheAtual: Tranche;
  proximaTranche: Tranche | null;
  tranches: Tranche[];
}

function fmtBEM(v: number) {
  if (v >= 1_000_000_000_000) return `${(v / 1_000_000_000_000).toFixed(2)}T`;
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  return v.toLocaleString("pt-BR");
}

function fmtUSD(v: number) {
  return `U$ ${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TokenPage() {
  const [data, setData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/token")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setData(j);
        else setErro(j.error ?? "Erro ao buscar dados do token");
      })
      .catch(() => setErro("Erro de conexão com a blockchain"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#CBA35C]/30 border-t-[#CBA35C] rounded-full animate-spin" />
        <p className="text-sm text-[#6B7280]">Consultando a blockchain...</p>
      </div>
    </div>
  );

  if (erro) return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-red-700">Erro ao conectar com a Polygon</p>
        <p className="text-xs text-red-500 mt-1">{erro}</p>
        <p className="text-xs text-red-400 mt-2">Verifique ALCHEMY_API_KEY e TREASURY_PRIVATE_KEY no Vercel.</p>
      </div>
    </div>
  );

  if (!data) return null;

  const progressoTranche = Math.min((data.totalMintado / data.trancheAtual.supply) * 100, 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Token BEM</h1>
        <p className="text-sm text-[#6B7280] mt-1">Gestão do contrato ERC-20 na Polygon Mainnet.</p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Mintado", value: fmtBEM(data.totalMintado), sub: "tokens em circulação", icon: Coins, color: "text-[#CBA35C]" },
          { label: "Treasury Hot Wallet", value: fmtBEM(data.treasury.balance), sub: "disponível para envio", icon: Wallet, color: "text-blue-500" },
          { label: "Tranche Atual", value: `#${data.trancheAtual.numero}`, sub: fmtUSD(data.trancheAtual.precoUsd) + " / BEM", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Gatilho Próxima Tranche", value: data.proximaTranche ? fmtUSD(data.trancheAtual.gatilho!) : "—", sub: data.proximaTranche ? `abre ${fmtBEM(data.proximaTranche.supply)} BEM` : "Última tranche", icon: AlertTriangle, color: "text-amber-500" },
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

      {/* Progresso da tranche atual */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#101820]">Progresso — Tranche {data.trancheAtual.numero}</h2>
          <span className="text-xs font-bold text-[#CBA35C]">{progressoTranche.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-[#F7F8F9] rounded-full overflow-hidden border border-[#E5E7EB]/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#CBA35C] to-[#E8C96A] transition-all duration-500"
            style={{ width: `${progressoTranche}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-[#9CA3AF]">{fmtBEM(data.totalMintado)} mintados</span>
          <span className="text-[11px] text-[#9CA3AF]">cap: {fmtBEM(data.trancheAtual.supply)}</span>
        </div>
        {data.proximaTranche && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Próxima tranche abre quando o BEM atingir <strong>{fmtUSD(data.trancheAtual.gatilho!)}</strong>.
              Serão mintados até <strong>{fmtBEM(data.proximaTranche.supply)}</strong> tokens adicionais.
              Holders terão prioridade de compra.
            </p>
          </div>
        )}
      </div>

      {/* Todas as tranches */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]/60">
          <h2 className="text-sm font-bold text-[#101820]">Roadmap de Tranches</h2>
        </div>
        <div className="divide-y divide-[#E5E7EB]/60">
          {data.tranches.map((t) => {
            const isAtual = t.numero === data.trancheAtual.numero;
            const isConcluida = t.numero < data.trancheAtual.numero;
            return (
              <div key={t.numero} className={`px-6 py-4 flex items-center gap-4 ${isAtual ? "bg-[#CBA35C]/5" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isConcluida ? "bg-emerald-100 text-emerald-600" : isAtual ? "bg-[#CBA35C]/20 text-[#CBA35C]" : "bg-[#F7F8F9] text-[#9CA3AF]"}`}>
                  {t.numero}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#101820]">{fmtBEM(t.supply)} BEM</span>
                    {isAtual && <span className="px-2 py-0.5 rounded-full bg-[#CBA35C]/15 text-[#CBA35C] text-[10px] font-bold uppercase tracking-widest">Ativa</span>}
                    {isConcluida && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Concluída</span>}
                  </div>
                  <p className="text-xs text-[#6B7280]">Preço: {fmtUSD(t.precoUsd)} · {t.gatilho ? `Gatilho: ${fmtUSD(t.gatilho)}` : "Supply máximo"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info do contrato */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-6">
        <h2 className="text-sm font-bold text-[#101820] mb-4">Contrato na Polygon</h2>
        <div className="space-y-3">
          {[
            { label: "Endereço do contrato", value: data.contrato },
            { label: "Owner (carteira mint)", value: data.owner },
            { label: "Treasury hot wallet", value: data.treasury.address },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-xs text-[#6B7280] w-40 shrink-0 pt-0.5">{row.label}</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono text-[#101820] truncate">{row.value}</span>
                <a
                  href={`https://polygonscan.com/address/${row.value}`}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[#CBA35C] hover:text-[#a78438]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
