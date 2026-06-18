export type SocialPlatform = 'telegram' | 'discord' | 'instagram' | 'facebook' | 'youtube' | 'tiktok'
export type SocialStatus = 'pending' | 'posted' | 'failed' | 'rejected' | 'manual'

export interface SocialPost {
  id: string
  created_at: string
  posted_at?: string
  theme_id: number
  theme_title: string
  platform: SocialPlatform
  content: Record<string, unknown>
  image_url?: string
  status: SocialStatus
  platform_post_id?: string
  error_message?: string
  requires_manual?: boolean
}

export interface Theme {
  id: number
  title: string
  hook: string
  keywords: string[]
  tone: string
}

export interface PublishResult {
  platform: SocialPlatform
  success: boolean
  postId?: string
  error?: string
  requiresManual?: boolean
}
