import { NextResponse } from 'next/server'
import { getTodayTheme } from '@/lib/social/themes'
import { generateContent } from '@/lib/social/claude'
import { savePendingPosts, getPosts } from '@/lib/social/supabase'
import { getRealEstateImage } from '@/lib/social/images'

export const maxDuration = 60

export async function POST() {
  const theme = getTodayTheme()
  const [contents, imageUrl] = await Promise.all([
    generateContent(theme),
    getRealEstateImage(theme.keywords),
  ])

  await savePendingPosts(theme.id, theme.title, contents, imageUrl)

  const posts = await getPosts(60)
  return NextResponse.json({ success: true, theme: theme.title, posts })
}
