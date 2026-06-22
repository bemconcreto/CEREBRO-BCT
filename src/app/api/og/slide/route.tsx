import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

async function loadManrope(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Manrope:wght@${weight}&display=swap`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      }
    ).then((r) => r.text())
    const match = css.match(/src: url\(([^)]+\.woff2)\)/)
    if (!match?.[1]) return null
    const res = await fetch(match[1])
    if (!res.ok) return null
    return res.arrayBuffer()
  } catch {
    return null
  }
}

// Strip emoji and non-Latin chars that may break Satori
function safeText(str: string): string {
  return str.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, '').trim()
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const bg = sp.get('bg') ?? 'dark'
  const line1 = safeText(sp.get('line1') ?? '')
  const line2 = safeText(sp.get('line2') ?? 'Bem Concreto Token.')
  const emoji = sp.get('emoji') ?? '🏢'

  const [lightFont, boldFont] = await Promise.all([loadManrope(300), loadManrope(800)])

  const fonts: { name: string; data: ArrayBuffer; weight: 300 | 800; style: 'normal' }[] = []
  if (lightFont) fonts.push({ name: 'Manrope', data: lightFont, weight: 300, style: 'normal' })
  if (boldFont) fonts.push({ name: 'Manrope', data: boldFont, weight: 800, style: 'normal' })

  const isDark = bg === 'dark'
  const bgColor = isDark ? '#101820' : '#d9d9d6'
  const line1Color = isDark ? '#d9d9d6' : '#7a5d53'
  const line2Color = isDark ? '#7a5d53' : '#101820'
  const pillBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const pillBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'
  const pillColor = isDark ? '#c8c8c5' : '#4c3b34'
  const glowColor = isDark
    ? 'rgba(122,93,83,0.4)'
    : 'rgba(122,93,83,0.12)'

  const totalLen = (line1 + ' ' + line2).length
  const fontSize = totalLen < 18 ? 100 : totalLen < 28 ? 84 : 70
  const ff = fonts.length > 0 ? 'Manrope' : 'sans-serif'

  // Map common emoji to a text label shown above headline
  const emojiLabels: Record<string, string> = {
    '🏢': 'IMÓVEL', '🏠': 'IMÓVEL', '🏗': 'OBRA', '💰': 'CAPITAL',
    '📈': 'RETORNO', '🌱': 'CRESCIMENTO', '🔒': 'SEGURANÇA', '⚖️': 'JURÍDICO',
    '🏛': 'ESTRUTURA', '🌐': 'BLOCKCHAIN', '💎': 'TOKEN', '🤝': 'PARCERIA',
  }
  const iconLabel = emojiLabels[emoji] ?? 'BEM'

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          backgroundColor: bgColor,
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: ff,
          position: 'relative',
        }}
      >
        {/* Glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '65%',
            height: '65%',
            backgroundImage: `radial-gradient(ellipse at top right, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        {/* Glow bottom-left (dark only) */}
        {isDark && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '45%',
              height: '45%',
              backgroundImage: 'radial-gradient(ellipse at bottom left, rgba(122,93,83,0.2) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Icon label top-left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? 'rgba(122,93,83,0.25)' : 'rgba(122,93,83,0.15)',
            borderRadius: 12,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            alignSelf: 'flex-start',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '3px',
              color: '#7a5d53',
              fontFamily: ff,
            }}
          >
            {iconLabel}
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            position: 'relative',
            marginTop: '-20px',
          }}
        >
          {line1.length > 0 && (
            <div
              style={{
                fontSize,
                fontWeight: 300,
                color: line1Color,
                lineHeight: 1.12,
                letterSpacing: '-2px',
                fontFamily: ff,
              }}
            >
              {line1}
            </div>
          )}
          <div
            style={{
              fontSize,
              fontWeight: 800,
              color: line2Color,
              lineHeight: 1.12,
              letterSpacing: '-2px',
              fontFamily: ff,
            }}
          >
            {line2}
          </div>
        </div>

        {/* Bottom: pill + hexagon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div
            style={{
              backgroundColor: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: 100,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 32,
              paddingRight: 32,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 22, color: pillColor, fontFamily: ff }}>
              arraste e saiba mais  ▷
            </span>
          </div>

          {/* Hexagon BC logo */}
          <svg width="92" height="92" viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg">
            <polygon points="46,4 86,26 86,66 46,88 6,66 6,26" fill="#7a5d53" />
            <text
              x="46"
              y="57"
              textAnchor="middle"
              fill="#d9d9d6"
              fontSize="25"
              fontWeight="bold"
            >
              BC
            </text>
          </svg>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  )
}
