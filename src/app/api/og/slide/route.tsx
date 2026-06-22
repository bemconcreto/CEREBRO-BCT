import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const maxDuration = 10

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const test = sp.get('test') === '1'

  if (test) {
    // Absolute minimum — no fonts, no text, just a solid red rectangle
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: 'red',
        }}
      />,
      { width: 1080, height: 1080 }
    )
  }

  const bg = sp.get('bg') ?? 'dark'
  const clean = (s: string) => s.replace(/[^\x20-\x7EÀ-ɏ]/g, '').trim()
  const line1 = clean(sp.get('line1') ?? '')
  const line2 = clean(sp.get('line2') ?? 'Bem Concreto Token.')

  const isDark = bg === 'dark'
  const bgColor = isDark ? '#101820' : '#d9d9d6'
  const line1Color = isDark ? '#d9d9d6' : '#7a5d53'
  const line2Color = isDark ? '#7a5d53' : '#101820'

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
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
          {line1.length > 0 && (
            <div style={{ display: 'flex', fontSize, fontWeight: 300, color: line1Color, lineHeight: 1.15 }}>
              {line1}
            </div>
          )}
          <div style={{ display: 'flex', fontSize, fontWeight: 800, color: line2Color, lineHeight: 1.15 }}>
            {line2}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            <div style={{ display: 'flex', color: '#d9d9d6', fontSize: 28, fontWeight: 800 }}>BC</div>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  )
}
