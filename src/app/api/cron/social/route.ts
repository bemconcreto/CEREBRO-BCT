import { NextResponse } from 'next/server'
import { getTodayTheme } from '@/lib/social/themes'
import { generateContent } from '@/lib/social/claude'
import { savePendingPosts, getTodayPosts } from '@/lib/social/supabase'
import { getRealEstateImage } from '@/lib/social/images'

export const maxDuration = 60

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return run()
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return run()
}

async function run() {
  const existing = await getTodayPosts()
  if (existing.length > 0) {
    return NextResponse.json({ skipped: true, message: 'Conteúdo de hoje já foi gerado', count: existing.length })
  }

  const theme = getTodayTheme()

  const [contents, imageUrl] = await Promise.all([
    generateContent(theme),
    getRealEstateImage(theme.keywords),
  ])

  await savePendingPosts(theme.id, theme.title, contents, imageUrl)

  return NextResponse.json({
    success: true,
    theme: theme.title,
    imageUrl,
    platforms: Object.keys(contents),
  })
}
