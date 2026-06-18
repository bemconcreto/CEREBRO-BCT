import { NextResponse } from 'next/server'
import { getPostById, updatePostStatus } from '@/lib/social/supabase'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })

  await updatePostStatus(id, 'rejected')
  return NextResponse.json({ success: true })
}
