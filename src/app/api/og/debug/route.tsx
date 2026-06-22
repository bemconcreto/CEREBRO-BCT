import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export const maxDuration = 10

export async function GET(_req: NextRequest) {
  const info: Record<string, unknown> = {
    cwd: process.cwd(),
    nodeVersion: process.version,
  }

  // 1. Check fs access to font files
  try {
    const lightPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-Light.woff2')
    const boldPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-ExtraBold.woff2')
    info.lightExists = fs.existsSync(lightPath)
    info.boldExists = fs.existsSync(boldPath)
    if (info.lightExists) {
      const buf = fs.readFileSync(lightPath)
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
      info.lightBufSize = buf.byteLength
      info.lightAbSize = ab.byteLength
    }
  } catch (err) {
    info.fsError = String(err)
  }

  // 2. Test ImageResponse WITHOUT fonts (should work)
  try {
    const resp = new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: 'green' }} />,
      { width: 200, height: 200 }
    )
    const ab = await resp.arrayBuffer()
    info.noFontImageBytes = ab.byteLength
  } catch (err) {
    info.noFontImageError = String(err)
  }

  // 3. Test ImageResponse WITH one font
  try {
    const lightPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-Light.woff2')
    const buf = fs.readFileSync(lightPath)
    const fontData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
    const resp = new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: 'blue', fontFamily: 'Manrope' }}>
        <div style={{ display: 'flex', color: 'white', fontSize: 40, fontFamily: 'Manrope', fontWeight: 300 }}>TEST</div>
      </div>,
      {
        width: 200,
        height: 200,
        fonts: [{ name: 'Manrope', data: fontData, weight: 300, style: 'normal' }],
      }
    )
    const ab = await resp.arrayBuffer()
    info.withFontImageBytes = ab.byteLength
  } catch (err) {
    info.withFontImageError = String(err)
  }

  return Response.json(info)
}
