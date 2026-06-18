import type { PublishResult } from '../types'

export async function publishToFacebook(text: string, imageUrl?: string): Promise<PublishResult> {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID

  if (!accessToken || !pageId) {
    return { platform: 'facebook', success: false, error: 'Missing META_PAGE_ACCESS_TOKEN or META_PAGE_ID' }
  }

  try {
    const endpoint = imageUrl
      ? `https://graph.facebook.com/v19.0/${pageId}/photos`
      : `https://graph.facebook.com/v19.0/${pageId}/feed`

    const body = imageUrl
      ? { message: text, url: imageUrl, access_token: accessToken }
      : { message: text, access_token: accessToken }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.id || data.post_id) return { platform: 'facebook', success: true, postId: data.id ?? data.post_id }
    return { platform: 'facebook', success: false, error: JSON.stringify(data) }
  } catch (e) {
    return { platform: 'facebook', success: false, error: String(e) }
  }
}
