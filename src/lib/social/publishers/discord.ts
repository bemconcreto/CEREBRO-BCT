import type { PublishResult } from '../types'

export async function publishToDiscord(
  title: string,
  description: string,
  fields: { name: string; value: string }[]
): Promise<PublishResult> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    return { platform: 'discord', success: false, error: 'Missing DISCORD_WEBHOOK_URL' }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title,
          description,
          color: 0xcba35c,
          fields: fields.slice(0, 25),
          footer: { text: 'BEM CONCRETO TOKEN • app.bemconcreto.com' },
          timestamp: new Date().toISOString(),
        }],
      }),
    })

    if (res.status === 204) return { platform: 'discord', success: true, postId: 'webhook' }
    const data = await res.json()
    return { platform: 'discord', success: false, error: JSON.stringify(data) }
  } catch (e) {
    return { platform: 'discord', success: false, error: String(e) }
  }
}
