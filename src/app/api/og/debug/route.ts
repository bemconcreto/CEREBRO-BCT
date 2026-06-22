import type { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const info: Record<string, unknown> = {
    cwd: process.cwd(),
    nodeVersion: process.version,
  }

  // 1. Check if font files exist
  try {
    const lightPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-Light.woff2')
    const boldPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-ExtraBold.woff2')
    info.lightPath = lightPath
    info.boldPath = boldPath
    info.lightExists = fs.existsSync(lightPath)
    info.boldExists = fs.existsSync(boldPath)

    if (info.lightExists) {
      const buf = fs.readFileSync(lightPath)
      info.lightSize = buf.byteLength
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
      info.lightAbSize = (ab as ArrayBuffer).byteLength
    }

    if (info.boldExists) {
      const buf = fs.readFileSync(boldPath)
      info.boldSize = buf.byteLength
    }
  } catch (err) {
    info.fsError = String(err)
  }

  // 2. Try ImageResponse without fonts
  try {
    const { ImageResponse } = await import('next/og')
    const resp = new ImageResponse(
      // @ts-expect-error jsx
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#101820' }} />,
      { width: 200, height: 200 }
    )
    const buf = await resp.arrayBuffer()
    info.imageResponseNoFont = `OK — ${buf.byteLength} bytes`
  } catch (err) {
    info.imageResponseNoFontError = String(err)
  }

  // 3. Try ImageResponse WITH fonts
  try {
    const { ImageResponse } = await import('next/og')
    const lightPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-Light.woff2')
    const buf = fs.readFileSync(lightPath)
    const fontData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer

    const resp = new ImageResponse(
      // @ts-expect-error jsx
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#101820', fontFamily: 'Manrope' }}>
        <div style={{ display: 'flex', color: '#7a5d53', fontSize: 40, fontFamily: 'Manrope' }}>TEST</div>
      </div>,
      {
        width: 200,
        height: 200,
        fonts: [{ name: 'Manrope', data: fontData, weight: 300, style: 'normal' }],
      }
    )
    const resBuf = await resp.arrayBuffer()
    info.imageResponseWithFont = `OK — ${resBuf.byteLength} bytes`
  } catch (err) {
    info.imageResponseWithFontError = String(err)
  }

  return Response.json(info, { status: 200 })
}
