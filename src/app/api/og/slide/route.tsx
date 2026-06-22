import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

async function loadManrope(weight: number): Promise<ArrayBuffer> {
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
  if (!match?.[1]) throw new Error(`Manrope ${weight} not found in Google Fonts CSS`)
  return fetch(match[1]).then((r) => r.arrayBuffer())
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const bg = sp.get('bg') ?? 'dark'
  const line1 = sp.get('line1') ?? ''
  const line2 = sp.get('line2') ?? 'Bem Concreto Token.'
  const emoji = sp.get('emoji') ?? '🏢'

  const [lightFont, boldFont] = await Promise.all([loadManrope(300), loadManrope(800)])

  const isDark = bg === 'dark'
  const bgColor = isDark ? '#101820' : '#d9d9d6'
  const line1Color = isDark ? '#d9d9d6' : '#7a5d53'
  const line2Color = isDark ? '#7a5d53' : '#101820'
  const pillBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const pillBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'
  const pillColor = isDark ? '#c8c8c5' : '#4c3b34'
  const glowBg = isDark
    ? 'linear-gradient(135deg, rgba(122,93,83,0.45) 0%, rgba(16,24,32,0) 55%)'
    : 'linear-gradient(315deg, rgba(122,93,83,0.14) 0%, rgba(217,217,214,0) 55%)'

  const totalLen = (line1 + ' ' + line2).length
  const fontSize = totalLen < 18 ? 100 : totalLen < 28 ? 84 : 70

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          background: bgColor,
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: 'Manrope',
          position: 'relative',
        }}
      >
        {/* Gradient glow overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '72%',
            height: '72%',
            background: glowBg,
          }}
        />
        {isDark && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '50%',
              height: '50%',
              background:
                'linear-gradient(315deg, rgba(122,93,83,0.18) 0%, rgba(16,24,32,0) 60%)',
            }}
          />
        )}

        {/* Emoji icon — top left */}
        <div style={{ fontSize: 68, lineHeight: 1, position: 'relative', zIndex: 1 }}>
          {emoji}
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            marginTop: '-24px',
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
                fontFamily: 'Manrope',
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
              fontFamily: 'Manrope',
            }}
          >
            {line2}
          </div>
        </div>

        {/* Bottom row: pill + hexagon logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* CTA pill */}
          <div
            style={{
              background: pillBg,
              border: `1px solid ${pillBorder}`,
              borderRadius: 100,
              padding: '14px 32px',
              fontSize: 22,
              color: pillColor,
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '0.2px',
              fontFamily: 'Manrope',
              fontWeight: 400,
            }}
          >
            arraste e saiba mais  ▷
          </div>

          {/* Hexagon BC logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 92,
              height: 92,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#7a5d53',
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              }}
            />
            <div
              style={{
                position: 'relative',
                color: '#d9d9d6',
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: '-1px',
                fontFamily: 'Manrope',
              }}
            >
              BC
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        { name: 'Manrope', data: lightFont, weight: 300, style: 'normal' },
        { name: 'Manrope', data: boldFont, weight: 800, style: 'normal' },
      ],
    }
  )
}
