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

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const bg = sp.get('bg') ?? 'dark'
  const line1 = (sp.get('line1') ?? '').replace(/[^\w\sÀ-ÿ.,!?'"-]/g, '').trim()
  const line2 = (sp.get('line2') ?? 'Bem Concreto Token.').replace(/[^\w\sÀ-ÿ.,!?'"-]/g, '').trim()

  const [lightFont, boldFont] = await Promise.all([loadManrope(300), loadManrope(800)])

  const fonts: { name: string; data: ArrayBuffer; weight: 300 | 800; style: 'normal' }[] = []
  if (lightFont) fonts.push({ name: 'Manrope', data: lightFont, weight: 300, style: 'normal' })
  if (boldFont) fonts.push({ name: 'Manrope', data: boldFont, weight: 800, style: 'normal' })

  const isDark = bg === 'dark'
  const bgColor = isDark ? '#101820' : '#d9d9d6'
  const line1Color = isDark ? '#d9d9d6' : '#7a5d53'
  const line2Color = isDark ? '#7a5d53' : '#101820'
  const ff = fonts.length > 0 ? 'Manrope' : 'sans-serif'

  const totalLen = (line1 + ' ' + line2).length
  const fontSize = totalLen < 18 ? 100 : totalLen < 28 ? 84 : 70

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          backgroundColor: bgColor,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          paddingLeft: 80,
          paddingRight: 80,
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        {line1.length > 0 && (
          <div
            style={{
              fontSize,
              fontWeight: 300,
              color: line1Color,
              lineHeight: 1.15,
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
            lineHeight: 1.15,
            letterSpacing: '-2px',
            fontFamily: ff,
          }}
        >
          {line2}
        </div>

        {/* CTA pill */}
        <div
          style={{
            marginTop: 60,
            alignSelf: 'flex-start',
            borderRadius: 100,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 32,
            paddingRight: 32,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
            display: 'flex',
          }}
        >
          <span style={{ fontSize: 22, color: isDark ? '#c8c8c5' : '#4c3b34', fontFamily: ff }}>
            arraste e saiba mais  &#9657;
          </span>
        </div>

        {/* Logo bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            right: 70,
            display: 'flex',
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <polygon points="40,3 75,22 75,58 40,77 5,58 5,22" fill="#7a5d53" />
            <text x="40" y="50" textAnchor="middle" fill="#d9d9d6" fontSize="22" fontWeight="bold">BC</text>
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
