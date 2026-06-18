import { NextResponse } from 'next/server'
import { getTodayTheme } from '@/lib/social/themes'
import { generateContent } from '@/lib/social/claude'
import { savePendingPosts, getTodayPosts, getPosts } from '@/lib/social/supabase'
import { getRealEstateImage } from '@/lib/social/images'

export const maxDuration = 60

export async function POST() {
  const existing = await getTodayPosts()
  if (existing.length > 0) {
    return NextResponse.json({ skipped: true, message: 'Conteúdo de hoje já foi gerado' })
  }

  const theme = getTodayTheme()
  const [contents, imageUrl] = await Promise.all([
    generateContent(theme),
    getRealEstateImage(theme.keywords),
  ])

  await savePendingPosts(theme.id, theme.title, contents, imageUrl)

  const posts = await getPosts(6)
  return NextResponse.json({ success: true, theme: theme.title, posts })
}
