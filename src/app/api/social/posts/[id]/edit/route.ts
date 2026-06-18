import { NextResponse } from 'next/server'
import { updatePostContent } from '@/lib/social/supabase'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { content } = await req.json()
  if (!content) return NextResponse.json({ error: 'content obrigatório' }, { status: 400 })

  await updatePostContent(id, content)
  return NextResponse.json({ success: true })
}
