import { NextResponse } from 'next/server'
import { getPostById, updatePostStatus } from '@/lib/social/supabase'
import { publishToTelegram } from '@/lib/social/publishers/telegram'
import { publishToDiscord } from '@/lib/social/publishers/discord'
import { publishToInstagram } from '@/lib/social/publishers/instagram'
import { publishToFacebook } from '@/lib/social/publishers/facebook'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
  if (post.status === 'posted') return NextResponse.json({ error: 'Já publicado' }, { status: 400 })

  const c = post.content
  let result

  switch (post.platform) {
    case 'telegram':
      result = await publishToTelegram(String(c.text ?? ''))
      break
    case 'discord':
      result = await publishToDiscord(
        String(c.title ?? ''),
        String(c.description ?? ''),
        (c.fields as { name: string; value: string }[]) ?? []
      )
      break
    case 'instagram':
      result = await publishToInstagram(
        String(c.caption ?? ''),
        (c.hashtags as string[]) ?? [],
        post.image_url ?? 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
      )
      break
    case 'facebook':
      result = await publishToFacebook(String(c.text ?? ''), post.image_url)
      break
    default:
      return NextResponse.json({ error: 'Plataforma manual — não é possível publicar automaticamente' }, { status: 400 })
  }

  if (result.success) {
    await updatePostStatus(id, 'posted', result.postId)
    return NextResponse.json({ success: true, postId: result.postId })
  } else {
    await updatePostStatus(id, 'failed', undefined, result.error)
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }
}
