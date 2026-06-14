"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [erro, setErro] = useState(false);

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
    setErro(false);

    try {
      const res = await fetch("/api/preco", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ precoUsd, cotacaoUsdBrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(true);
        setMensagem(data.error || "Erro ao salvar preço");
        return;
      }

      setPreco(data);
      setMensagem("Preço atualizado com sucesso.");
    } catch {
      setErro(true);
      setMensagem("Erro ao salvar preço");
    } finally {
      setSalvando(false);
    }
  }

  const precoBrl = precoUsd * cotacaoUsdBrl;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101820] tracking-tight">Preço do BEM</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Define o preço do token BEM (BCT) usado em todo o ecossistema
          (APP, Consultor, Landpage e Certificação).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard icon={DollarSign} title="Preço atual (USD)" value={`US$ ${precoUsd.toFixed(2)}`} />
        <KpiCard icon={TrendingUp} title="Cotação USD/BRL" value={`R$ ${cotacaoUsdBrl.toFixed(2)}`} />
        <KpiCard icon={Coins} title="Preço atual (BRL)" value={`R$ ${precoBrl.toFixed(2)}`} />
      </div>

      <Card className="max-w-120">
        <CardHeader>
          <CardTitle>Atualizar preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Preço do BEM (USD)</Label>
            <Input
              type="number"
              step="0.01"
              value={precoUsd}
              onChange={(e) => setPrecoUsd(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Cotação USD/BRL</Label>
            <Input
              type="number"
              step="0.01"
              value={cotacaoUsdBrl}
              onChange={(e) => setCotacaoUsdBrl(Number(e.target.value))}
            />
          </div>

          <p className="text-sm text-[#6B7280]">
            Preço resultante em BRL: <strong className="text-[#101820]">R$ {precoBrl.toFixed(2)}</strong>
          </p>

          <Button onClick={salvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </Button>

          {mensagem && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
                erro
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              )}
            >
              {mensagem}
            </div>
          )}

          {preco && (
            <p className="text-xs text-[#6B7280]">
              Última atualização: {new Date(preco.updatedAt).toLocaleString("pt-BR")}
              {preco.updatedBy ? ` por ${preco.updatedBy}` : ""}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
