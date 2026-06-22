import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

async function loadManrope(weight: number): Promise<ArrayBuffer | null> {
  try {
    // Fetch CSS from Google Fonts to get the actual CDN URL dynamically
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

    // Extract the first woff2 URL (latin subset)
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
  // Strip emojis and keep only printable latin chars
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
          width: 1080,
          height: 1080,
          backgroundColor: bgColor,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        {/* Debug: font status indicator */}
        <div
          style={{
            display: 'flex',
            backgroundColor: hasFont ? '#7a5d53' : '#cc0000',
            borderRadius: 8,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            alignSelf: 'flex-start',
            marginBottom: 40,
          }}
        >
          <span style={{ color: 'white', fontSize: 20 }}>
            {hasFont ? 'MANROPE OK' : 'NO FONT'}
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
          {line1.length > 0 && (
            <div style={{ fontSize, fontWeight: 300, color: line1Color, lineHeight: 1.15, fontFamily: ff }}>
              {line1}
            </div>
          )}
          <div style={{ fontSize, fontWeight: 800, color: line2Color, lineHeight: 1.15, fontFamily: ff }}>
            {line2}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              borderRadius: 100,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 32,
              paddingRight: 32,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
            }}
          >
            <span style={{ color: isDark ? '#c8c8c5' : '#4c3b34', fontSize: 22, fontFamily: ff }}>
              arraste e saiba mais
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              width: 80,
              height: 80,
              backgroundColor: '#7a5d53',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#d9d9d6', fontSize: 28, fontWeight: 800, fontFamily: ff }}>BC</span>
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
