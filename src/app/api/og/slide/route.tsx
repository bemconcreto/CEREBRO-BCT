import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export const maxDuration = 10

function loadFont(filename: string): ArrayBuffer | null {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', filename))
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

function loadImageB64(filename: string): string | null {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', filename))
    return `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

const PALETTES = {
  dark:      { bg: '#101820', t1: '#d9d9d6', t2: '#7a5d53', sub: 'rgba(216,216,213,0.38)', pill: 'rgba(255,255,255,0.14)', pillT: '#c8c8c5', accent: '#7a5d53' },
  light:     { bg: '#d9d9d6', t1: '#7a5d53', t2: '#101820', sub: 'rgba(0,0,0,0.28)',        pill: 'rgba(0,0,0,0.12)',       pillT: '#4c3b34', accent: '#101820' },
  terracota: { bg: '#7a5d53', t1: '#d9d9d6', t2: '#101820', sub: 'rgba(217,217,214,0.48)', pill: 'rgba(255,255,255,0.2)',  pillT: '#d9d9d6', accent: '#101820' },
} as const

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const bg = (sp.get('bg') ?? 'dark') as keyof typeof PALETTES
  const layout = sp.get('layout') ?? 'headline'
  const clean = (s: string) => s.replace(/[^\x20-\x7EÀ-ɏ.,!?'"()\-]/g, '').trim()
  const line1 = clean(sp.get('line1') ?? '')
  const line2 = clean(sp.get('line2') ?? 'Bem Concreto Token.')

  const lightData = loadFont('Manrope-Light.ttf')
  const boldData  = loadFont('Manrope-ExtraBold.ttf')
  const hasFont   = !!(lightData && boldData)
  const sym       = loadImageB64('logo-bct2.png')   // hexagon symbol
  const fullLogo  = loadImageB64('logo-bct.png')    // hexagon + text

  const fonts: { name: string; data: ArrayBuffer; weight: 300 | 800; style: 'normal' }[] = []
  if (lightData) fonts.push({ name: 'Manrope', data: lightData, weight: 300, style: 'normal' })
  if (boldData)  fonts.push({ name: 'Manrope', data: boldData,  weight: 800, style: 'normal' })

  const p   = PALETTES[bg] ?? PALETTES.dark
  const ff  = hasFont ? 'Manrope' : 'sans-serif'
  const len = (line1 + ' ' + line2).length

  // ─── layout: statement ─────────────────────────────────────────────────────
  // Mega text filling most of the image — minimal chrome, logo bottom-right only
  if (layout === 'statement') {
    const sz = len < 12 ? 148 : len < 20 ? 118 : len < 30 ? 94 : 76
    return new ImageResponse(
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', backgroundColor: p.bg, padding: '80px', fontFamily: ff }}>
        <div style={{ display: 'flex', color: p.sub, fontSize: 22, fontWeight: 300 }}>BEMCONCRETO.COM</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {line1.length > 0 && (
            <div style={{ display: 'flex', fontSize: Math.round(sz * 0.62), fontWeight: 300, color: p.t1, lineHeight: 1.05, marginBottom: 12 }}>{line1}</div>
          )}
          <div style={{ display: 'flex', fontSize: sz, fontWeight: 800, color: p.t2, lineHeight: 1.0 }}>{line2}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {sym
            ? <img src={sym} width={88} height={88} style={{ objectFit: 'contain' }} />
            : <div style={{ display: 'flex', width: 88, height: 88, borderRadius: 12, backgroundColor: '#7a5d53', alignItems: 'center', justifyContent: 'center' }}><div style={{ display: 'flex', color: '#d9d9d6', fontSize: 26, fontWeight: 800 }}>BEM</div></div>
          }
        </div>
      </div>,
      { width: 1080, height: 1080, fonts: fonts.length ? fonts : undefined }
    )
  }

  // ─── layout: split ──────────────────────────────────────────────────────────
  // Left 60% text panel + Right 40% accent panel with full logo centered
  if (layout === 'split') {
    const sz = len < 22 ? 80 : len < 32 ? 66 : 54
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', fontFamily: ff }}>
        {/* Text panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '60%', height: '100%', backgroundColor: p.bg, padding: '72px', paddingRight: '44px' }}>
          <div style={{ display: 'flex', color: p.sub, fontSize: 22, fontWeight: 300 }}>BEMCONCRETO.COM</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {line1.length > 0 && (
              <div style={{ display: 'flex', fontSize: sz, fontWeight: 300, color: p.t1, lineHeight: 1.1, marginBottom: 6 }}>{line1}</div>
            )}
            <div style={{ display: 'flex', fontSize: sz, fontWeight: 800, color: p.t2, lineHeight: 1.1 }}>{line2}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: 100, paddingTop: 14, paddingBottom: 14, paddingLeft: 28, paddingRight: 28, border: `2px solid ${p.pill}`, width: 'max-content' }}>
            <div style={{ display: 'flex', color: p.pillT, fontSize: 20, fontWeight: 300 }}>arraste e saiba mais  &gt;</div>
          </div>
        </div>
        {/* Accent panel */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40%', height: '100%', backgroundColor: p.accent }}>
          {fullLogo
            ? <img src={fullLogo} width={200} height={200} style={{ objectFit: 'contain' }} />
            : <div style={{ display: 'flex', color: p.bg === '#101820' ? '#d9d9d6' : '#101820', fontSize: 56, fontWeight: 800 }}>BEM</div>
          }
        </div>
      </div>,
      { width: 1080, height: 1080, fonts: fonts.length ? fonts : undefined }
    )
  }

  // ─── layout: headline (default) ─────────────────────────────────────────────
  const sz = len < 16 ? 108 : len < 24 ? 90 : len < 32 ? 74 : 62
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', backgroundColor: p.bg, padding: '80px', fontFamily: ff }}>
      <div style={{ display: 'flex', color: p.sub, fontSize: 22, fontWeight: 300 }}>BEMCONCRETO.COM</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {line1.length > 0 && (
          <div style={{ display: 'flex', fontSize: sz, fontWeight: 300, color: p.t1, lineHeight: 1.1, marginBottom: 6 }}>{line1}</div>
        )}
        <div style={{ display: 'flex', fontSize: sz, fontWeight: 800, color: p.t2, lineHeight: 1.1 }}>{line2}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: 100, paddingTop: 16, paddingBottom: 16, paddingLeft: 36, paddingRight: 36, border: `2px solid ${p.pill}` }}>
          <div style={{ display: 'flex', color: p.pillT, fontSize: 22, fontWeight: 300 }}>arraste e saiba mais  &gt;</div>
        </div>
        {sym
          ? <img src={sym} width={88} height={88} style={{ objectFit: 'contain' }} />
          : <div style={{ display: 'flex', width: 88, height: 88, borderRadius: 12, backgroundColor: '#7a5d53', alignItems: 'center', justifyContent: 'center' }}><div style={{ display: 'flex', color: '#d9d9d6', fontSize: 26, fontWeight: 800 }}>BEM</div></div>
        }
      </div>
    </div>,
    { width: 1080, height: 1080, fonts: fonts.length ? fonts : undefined }
  )
}
