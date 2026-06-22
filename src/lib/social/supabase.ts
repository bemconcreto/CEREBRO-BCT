import { createClient } from '@supabase/supabase-js'
import type { SocialPost, SocialPlatform, SocialStatus } from './types'

const supabaseSocial = createClient(
  process.env.SOCIAL_SUPABASE_URL!,
  process.env.SOCIAL_SUPABASE_KEY!
)

export async function savePendingPosts(
  themeId: number,
  themeTitle: string,
  platformContents: Record<string, Record<string, unknown>>,
  platformImageUrls?: Record<string, string>
): Promise<void> {
  const platforms: SocialPlatform[] = ['telegram', 'discord', 'instagram', 'facebook', 'youtube', 'tiktok']
  const manualPlatforms: SocialPlatform[] = ['youtube', 'tiktok']

  const rows = platforms.map((platform) => ({
    theme_id: themeId,
    theme_title: themeTitle,
    platform,
    content: platformContents[platform] ?? {},
    image_url: platformImageUrls?.[platform] ?? null,
    status: (manualPlatforms.includes(platform) ? 'manual' : 'pending') as SocialStatus,
    requires_manual: manualPlatforms.includes(platform),
  }))

  const { error } = await supabaseSocial.from('social_posts').insert(rows)
  if (error) throw new Error(`Supabase insert error: ${error.message}`)
}

export async function getPosts(limit = 60): Promise<SocialPost[]> {
  const { data, error } = await supabaseSocial
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error(error); return [] }
  return (data as SocialPost[]) ?? []
}

export async function getPostById(id: string): Promise<SocialPost | null> {
  const { data, error } = await supabaseSocial
    .from('social_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as SocialPost
}

export async function updatePostStatus(
  id: string,
  status: SocialStatus,
  postId?: string,
  errorMessage?: string
): Promise<void> {
  const update: Record<string, unknown> = { status }
  if (postId) update.platform_post_id = postId
  if (errorMessage) update.error_message = errorMessage
  if (status === 'posted') update.posted_at = new Date().toISOString()

  const { error } = await supabaseSocial.from('social_posts').update(update).eq('id', id)
  if (error) throw new Error(`Supabase update error: ${error.message}`)
}

export async function updatePostContent(
  id: string,
  content: Record<string, unknown>
): Promise<void> {
  const { error } = await supabaseSocial.from('social_posts').update({ content }).eq('id', id)
  if (error) throw new Error(`Supabase update error: ${error.message}`)
}

export async function getTodayPosts(): Promise<SocialPost[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data } = await supabaseSocial
    .from('social_posts')
    .select('*')
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: true })

  return (data as SocialPost[]) ?? []
}
