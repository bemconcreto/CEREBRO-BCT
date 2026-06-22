import { NextResponse } from 'next/server'
import { getTodayTheme } from '@/lib/social/themes'
import { generateContent } from '@/lib/social/claude'
import { savePendingPosts, getPosts } from '@/lib/social/supabase'

export const maxDuration = 60

function buildSlideUrl(baseUrl: string, slide: Record<string, string>, fallbackTitle: string): string {
  const params = new URLSearchParams({
    bg:     slide.bg     ?? 'dark',
    layout: slide.layout ?? 'headline',
    line1:  slide.line1  ?? '',
    line2:  slide.line2  ?? fallbackTitle,
  })
  return `${baseUrl}/api/og/slide?${params.toString()}`
}

export async function POST() {
  const theme = getTodayTheme()
  const contents = await generateContent(theme)

  const baseUrl = process.env.NEXT_PUBLIC_CEREBRO_URL ?? 'https://cerebro.bemconcreto.com'
  const platformImageUrls: Record<string, string> = {}

  const igSlide = (contents.instagram as Record<string, unknown>)?.slide as Record<string, string> | undefined
  const fbSlide = (contents.facebook as Record<string, unknown>)?.slide as Record<string, string> | undefined

  if (igSlide?.line2) {
    platformImageUrls.instagram = buildSlideUrl(baseUrl, igSlide, theme.title)
  }
  if (fbSlide?.line2) {
    platformImageUrls.facebook = buildSlideUrl(baseUrl, fbSlide, theme.title)
  }

  await savePendingPosts(theme.id, theme.title, contents, platformImageUrls)

  const posts = await getPosts(60)
  return NextResponse.json({ success: true, theme: theme.title, posts })
}
