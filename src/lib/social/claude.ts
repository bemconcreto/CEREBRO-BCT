import Anthropic from '@anthropic-ai/sdk'
import type { Theme } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const BEM_CONTEXT = `
MARCA: BEM CONCRETO TOKEN
Token: BEM (símbolo oficial). Nunca usar "BCT" — nome antigo descontinuado.
Preço atual: U$0,60 por token BEM (Tranche 1 — fase atual)
Investimento mínimo: R$100
Taxa de venda: 10%
Prazo de liquidação: 180 dias
Contrato ERC-20 na Polygon Mainnet: 0x9740D64f94298A75087B7Da605685F284d817734
CNPJ: 37.566.745/0001-22
Website: www.bemconcreto.com
App do investidor: app.bemconcreto.com
WhatsApp: +55 11 96586-2850

MODELO DE NEGÓCIO:
- Tokenização imobiliária — o token BEM representa participação em imóveis reais de alto padrão
- Compra imóveis via leilão (até 50% abaixo do mercado) e incorporação (fase de planta = mais lucrativo)
- Usa SCP (Sociedade em Conta de Participação) e SPE (Sociedade de Propósito Específico)
- Transparência on-chain: qualquer um pode verificar emissões na blockchain Polygon
- Distribuição dos recursos: 20% Reserva, 30% Liquidez, 30% Imóveis, 20% Custos

TRANCHES (preço dobra a cada tranche):
- Tranche 1: 10M tokens a U$0,60 (ATUAL)
- Tranche 2: 100M tokens a U$1,20
- Tranche 3: 1B tokens a U$2,40

CONSULTORES CERTIFICADOS:
- 4% de comissão em cada compra de seus indicados
- Plataforma própria: consultor.bemconcreto.com
- Certificação: certificacao.bemconcreto.com

TOM DE VOZ: Sofisticado, confiante, educativo, acessível. Em português brasileiro.
Público: Investidores iniciantes e intermediários, público cripto e imobiliário.
`

export async function generateContent(theme: Theme): Promise<Record<string, Record<string, unknown>>> {
  const prompt = `
Você é o gerente de marketing do BEM CONCRETO TOKEN.

${BEM_CONTEXT}

TEMA DE HOJE: "${theme.title}"
HOOK DE ABERTURA: "${theme.hook}"
TOM: ${theme.tone}

Gere conteúdo ORIGINAL, DIFERENTE e ADAPTADO ao formato de cada plataforma.
Retorne APENAS um JSON válido com esta estrutura exata:

{
  "instagram": {
    "caption": "legenda completa com emojis, máximo 2200 caracteres, quebras de linha, CTA no final",
    "hashtags": ["array", "com", "20", "hashtags", "sem", "o", "simbolo", "#"]
  },
  "facebook": {
    "text": "post completo para Facebook, tom mais conversacional, pode ser mais longo, com link no final: app.bemconcreto.com"
  },
  "telegram": {
    "text": "mensagem completa em HTML do Telegram. Use <b>negrito</b>, <i>itálico</i>, emojis. Tom educativo e direto. Sem hashtags."
  },
  "discord": {
    "title": "título curto e impactante para o embed",
    "description": "descrição principal do embed, markdown do Discord",
    "fields": [
      { "name": "campo 1", "value": "valor 1" },
      { "name": "campo 2", "value": "valor 2" },
      { "name": "🔗 Invista agora", "value": "app.bemconcreto.com" }
    ]
  },
  "youtube": {
    "title": "título otimizado para SEO do YouTube, máx 100 chars",
    "description": "descrição completa com timestamps, links, hashtags",
    "tags": ["array", "com", "15", "tags", "youtube"]
  },
  "tiktok": {
    "script": "roteiro do vídeo: GANCHO (0-3s) + DESENVOLVIMENTO (3-45s) + CTA (45-60s)",
    "caption": "legenda do TikTok, máx 2200 chars, com emojis",
    "hashtags": ["array", "com", "10", "hashtags", "sem", "#"]
  }
}
`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude retornou formato inválido')

  return JSON.parse(jsonMatch[0]) as Record<string, Record<string, unknown>>
}
