import { NextResponse } from 'next/server'
import { getPosts, getTodayPosts } from '@/lib/social/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const today = searchParams.get('today') === 'true'

  const posts = today ? await getTodayPosts() : await getPosts(60)
  return NextResponse.json({ posts })
}
