import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

// Node.js runtime — more compatible with next/og than edge
export const maxDuration = 30

async function loadManrope(weight: number): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Manrope:wght@${weight}&display=swap`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      }
    )
    if (!cssRes.ok) return null
    const css = await cssRes.text()
    const match = css.match(/src: url\((https:\/\/fonts\.gstatic\.com[^)]+\.woff2)\)/)
    if (!match?.[1]) return null
    const fontRes = await fetch(match[1])
    if (!fontRes.ok) return null
    return fontRes.arrayBuffer()
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const bg = sp.get('bg') ?? 'dark'
  const clean = (s: string) => s.replace(/[^\x20-\x7EÀ-ɏ]/g, '').trim()
  const line1 = clean(sp.get('line1') ?? '')
  const line2 = clean(sp.get('line2') ?? 'Bem Concreto Token.')

  const [lightFont, boldFont] = await Promise.all([loadManrope(300), loadManrope(800)])
  const hasFont = !!(lightFont && boldFont)

  const fonts: { name: string; data: ArrayBuffer; weight: 300 | 800; style: 'normal' }[] = []
  if (lightFont) fonts.push({ name: 'Manrope', data: lightFont, weight: 300, style: 'normal' })
  if (boldFont) fonts.push({ name: 'Manrope', data: boldFont, weight: 800, style: 'normal' })

  const isDark = bg === 'dark'
  const bgColor = isDark ? '#101820' : '#d9d9d6'
  const line1Color = isDark ? '#d9d9d6' : '#7a5d53'
  const line2Color = isDark ? '#7a5d53' : '#101820'
  const ff = hasFont ? 'Manrope' : 'sans-serif'

  const totalLen = (line1 + ' ' + line2).length
  const fontSize = totalLen < 18 ? 100 : totalLen < 28 ? 84 : 70

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: bgColor,
          padding: '80px',
        }}
      >
        {/* Font status badge */}
        <div
          style={{
            display: 'flex',
            backgroundColor: hasFont ? '#7a5d53' : '#cc0000',
            borderRadius: '8px',
            padding: '8px 16px',
            marginBottom: '40px',
            alignSelf: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', color: 'white', fontSize: 20, fontFamily: ff }}>
            {hasFont ? 'MANROPE OK' : 'NO FONT — FALLBACK'}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {line1.length > 0 && (
            <div style={{ display: 'flex', fontSize, fontWeight: 300, color: line1Color, lineHeight: 1.15, fontFamily: ff }}>
              {line1}
            </div>
          )}
          <div style={{ display: 'flex', fontSize, fontWeight: 800, color: line2Color, lineHeight: 1.15, fontFamily: ff }}>
            {line2}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              borderRadius: '100px',
              padding: '14px 32px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
            }}
          >
            <div style={{ display: 'flex', color: isDark ? '#c8c8c5' : '#4c3b34', fontSize: 22, fontFamily: ff }}>
              arraste e saiba mais
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              width: '80px',
              height: '80px',
              backgroundColor: '#7a5d53',
              borderRadius: '8px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', color: '#d9d9d6', fontSize: 28, fontWeight: 800, fontFamily: ff }}>BC</div>
          </div>
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
