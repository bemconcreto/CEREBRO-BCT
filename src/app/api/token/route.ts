import { NextResponse } from "next/server";
import { getTokenInfo, getTreasuryBalance } from "@/lib/bem-chain";

export const dynamic = "force-dynamic";

const TRANCHES = [
  { numero: 1, supply: 10_000_000,         precoUsd: 0.60,  gatilho: 1.20 },
  { numero: 2, supply: 100_000_000,        precoUsd: 1.20,  gatilho: 2.40 },
  { numero: 3, supply: 1_000_000_000,      precoUsd: 2.40,  gatilho: 4.80 },
  { numero: 4, supply: 10_000_000_000,     precoUsd: 4.80,  gatilho: 9.60 },
  { numero: 5, supply: 100_000_000_000,    precoUsd: 9.60,  gatilho: 19.20 },
  { numero: 6, supply: 1_000_000_000_000,  precoUsd: 19.20, gatilho: null },
];

export async function GET() {
  try {
    const [tokenInfo, treasury] = await Promise.all([
      getTokenInfo(),
      getTreasuryBalance(),
    ]);

    const totalMintado = tokenInfo.supply;
    const trancheAtual = TRANCHES.find((t) => totalMintado <= t.supply) ?? TRANCHES[5];
    const trancheIndex = TRANCHES.indexOf(trancheAtual);
    const proximaTranche = TRANCHES[trancheIndex + 1] ?? null;

    return NextResponse.json({
      success: true,
      contrato: tokenInfo.contract,
      owner: tokenInfo.owner,
      totalMintado,
      treasury,
      trancheAtual,
      proximaTranche,
      tranches: TRANCHES,
    });
  } catch (err) {
    console.error("Erro ao buscar dados do token:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
