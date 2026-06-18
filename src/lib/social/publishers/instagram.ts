import type { PublishResult } from '../types'

export async function publishToInstagram(
  caption: string,
  hashtags: string[],
  imageUrl: string
): Promise<PublishResult> {
  const accessToken = process.env.META_INSTAGRAM_TOKEN
  const igUserId = process.env.META_IG_USER_ID

  if (!accessToken || !igUserId) {
    return { platform: 'instagram', success: false, error: 'Missing META_INSTAGRAM_TOKEN or META_IG_USER_ID' }
  }

  const fullCaption = `${caption}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`

  try {
    const createRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, caption: fullCaption, access_token: accessToken }),
      }
    )
    const createData = await createRes.json()
    if (!createData.id) return { platform: 'instagram', success: false, error: JSON.stringify(createData) }

    const publishRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: createData.id, access_token: accessToken }),
      }
    )
    const publishData = await publishRes.json()
    if (publishData.id) return { platform: 'instagram', success: true, postId: publishData.id }
    return { platform: 'instagram', success: false, error: JSON.stringify(publishData) }
  } catch (e) {
    return { platform: 'instagram', success: false, error: String(e) }
  }
}
