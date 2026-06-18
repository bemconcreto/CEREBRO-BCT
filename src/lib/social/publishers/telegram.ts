import type { PublishResult } from '../types'

export async function publishToTelegram(text: string): Promise<PublishResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const channelId = process.env.TELEGRAM_CHANNEL_ID

  if (!token || !channelId) {
    return { platform: 'telegram', success: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID' }
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: channelId, text, parse_mode: 'HTML' }),
    })
    const data = await res.json()
    if (data.ok) return { platform: 'telegram', success: true, postId: String(data.result.message_id) }
    return { platform: 'telegram', success: false, error: JSON.stringify(data) }
  } catch (e) {
    return { platform: 'telegram', success: false, error: String(e) }
  }
}
