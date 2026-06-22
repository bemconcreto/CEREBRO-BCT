import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export const maxDuration = 10

function loadLocalFont(filename: string): ArrayBuffer | null {
  try {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', filename)
    const buf = fs.readFileSync(fontPath)
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const bg = sp.get('bg') ?? 'dark'
  const clean = (s: string) => s.replace(/[^\x20-\x7EÀ-ɏ.,!?'"()-]/g, '').trim()
  const line1 = clean(sp.get('line1') ?? '')
  const line2 = clean(sp.get('line2') ?? 'Bem Concreto Token.')

  const lightFontData = loadLocalFont('Manrope-Light.ttf')
  const boldFontData = loadLocalFont('Manrope-ExtraBold.ttf')
  const hasFont = !!(lightFontData && boldFontData)

  const fonts: { name: string; data: ArrayBuffer; weight: 300 | 800; style: 'normal' }[] = []
  if (lightFontData) fonts.push({ name: 'Manrope', data: lightFontData, weight: 300, style: 'normal' })
  if (boldFontData) fonts.push({ name: 'Manrope', data: boldFontData, weight: 800, style: 'normal' })

  const isDark = bg === 'dark'
  const bgColor = isDark ? '#101820' : '#d9d9d6'
  const line1Color = isDark ? '#d9d9d6' : '#7a5d53'
  const line2Color = isDark ? '#7a5d53' : '#101820'
  const subtitleColor = isDark ? 'rgba(216,216,213,0.45)' : 'rgba(0,0,0,0.35)'
  const pillBorderColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'
  const pillTextColor = isDark ? '#c8c8c5' : '#4c3b34'
  const ff = hasFont ? 'Manrope' : 'sans-serif'

  const totalLen = (line1 + ' ' + line2).length
  const fontSize = totalLen < 16 ? 108 : totalLen < 24 ? 92 : totalLen < 32 ? 76 : 64

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: bgColor,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 80,
          paddingRight: 80,
          fontFamily: ff,
        }}
      >
        {/* Top — domain label */}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', color: subtitleColor, fontSize: 22, fontWeight: 300 }}>
            BEMCONCRETO.COM
          </div>
        </div>

        {/* Center — headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {line1.length > 0 && (
            <div
              style={{
                display: 'flex',
                fontSize,
                fontWeight: 300,
                color: line1Color,
                lineHeight: 1.1,
              }}
            >
              {line1}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontSize,
              fontWeight: 800,
              color: line2Color,
              lineHeight: 1.1,
            }}
          >
            {line2}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Pill CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 100,
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 36,
              paddingRight: 36,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: pillBorderColor,
            }}
          >
            <div style={{ display: 'flex', color: pillTextColor, fontSize: 24, fontWeight: 300 }}>
              arraste e saiba mais  &gt;
            </div>
          </div>

          {/* BC badge */}
          <div
            style={{
              display: 'flex',
              width: 88,
              height: 88,
              backgroundColor: '#7a5d53',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', color: '#d9d9d6', fontSize: 30, fontWeight: 800 }}>
              BC
            </div>
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
