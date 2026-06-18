'use client'

import { useState } from 'react'
import type { SocialPost } from '@/lib/social/types'

const PLATFORM_ICONS: Record<string, string> = {
  telegram: '✈️', discord: '🎮', instagram: '📸', facebook: '👤', youtube: '▶️', tiktok: '🎵',
}

const PLATFORM_LABELS: Record<string, string> = {
  telegram: 'Telegram', discord: 'Discord', instagram: 'Instagram',
  facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok',
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  posted: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-400 border border-red-500/30',
  rejected: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  manual: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
}

const STATUS_LABEL: Record<string, string> = {
  pending: '⏳ Aguardando', posted: '✓ Publicado', failed: '✗ Falhou',
  rejected: '— Rejeitado', manual: '📋 Manual',
}

function getPreviewText(post: SocialPost): string {
  const c = post.content
  if (post.platform === 'telegram') return String(c.text ?? '').replace(/<[^>]+>/g, '').slice(0, 200)
  if (post.platform === 'discord') return String(c.description ?? '').slice(0, 200)
  if (post.platform === 'instagram') return String(c.caption ?? '').slice(0, 200)
  if (post.platform === 'facebook') return String(c.text ?? '').slice(0, 200)
  if (post.platform === 'youtube') return `${c.title}\n\n${String(c.description ?? '').slice(0, 150)}`
  if (post.platform === 'tiktok') return String(c.script ?? '').slice(0, 200)
  return ''
}

function getEditableText(post: SocialPost): string {
  const c = post.content
  if (post.platform === 'telegram') return String(c.text ?? '')
  if (post.platform === 'discord') return String(c.description ?? '')
  if (post.platform === 'instagram') return String(c.caption ?? '')
  if (post.platform === 'facebook') return String(c.text ?? '')
  if (post.platform === 'youtube') return String(c.description ?? '')
  if (post.platform === 'tiktok') return String(c.caption ?? '')
  return ''
}

function buildUpdatedContent(post: SocialPost, newText: string): Record<string, unknown> {
  const c = { ...post.content }
  if (post.platform === 'telegram') c.text = newText
  else if (post.platform === 'discord') c.description = newText
  else if (post.platform === 'instagram') c.caption = newText
  else if (post.platform === 'facebook') c.text = newText
  else if (post.platform === 'youtube') c.description = newText
  else if (post.platform === 'tiktok') c.caption = newText
  return c
}

interface PostCardProps {
  post: SocialPost
  onUpdate: (id: string, newStatus: string) => void
}

function PostCard({ post, onUpdate }: PostCardProps) {
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(getEditableText(post))
  const [error, setError] = useState('')

  const isManual = post.platform === 'youtube' || post.platform === 'tiktok'
  const canAct = post.status === 'pending' || post.status === 'failed'

  async function handleApprove() {
    setLoading(true); setError('')
    try {
      if (editing) {
        const newContent = buildUpdatedContent(post, editText)
        await fetch(`/api/social/posts/${post.id}/edit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newContent }),
        })
      }
      const res = await fetch(`/api/social/posts/${post.id}/approve`, { method: 'POST' })
      const data = await res.json()
      if (data.success) { onUpdate(post.id, 'posted'); setEditing(false) }
      else setError(data.error ?? 'Erro ao publicar')
    } catch (e) { setError(String(e)) }
    setLoading(false)
  }

  async function handleReject() {
    setLoading(true)
    await fetch(`/api/social/posts/${post.id}/reject`, { method: 'POST' })
    onUpdate(post.id, 'rejected')
    setLoading(false)
  }

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[post.platform]}</span>
          <span className="font-semibold text-white">{PLATFORM_LABELS[post.platform]}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[post.status] ?? STATUS_STYLE.pending}`}>
          {STATUS_LABEL[post.status] ?? post.status}
        </span>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full h-32 object-cover rounded-xl opacity-80" />
      )}

      {editing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full bg-[#101820] border border-[#CBA35C]/40 rounded-xl p-3 text-sm text-white/90 resize-none"
          rows={6}
        />
      ) : (
        <p className="text-sm text-white/60 leading-relaxed line-clamp-4">{getPreviewText(post)}…</p>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {canAct && !isManual && (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 bg-[#CBA35C] hover:bg-[#E8C96A] disabled:opacity-50 text-black text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            {loading ? '...' : editing ? 'Salvar e Publicar' : '✓ Aprovar'}
          </button>
          <button
            onClick={() => { setEditing(!editing); setEditText(getEditableText(post)) }}
            className="px-3 py-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-sm rounded-xl transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-3 py-2 border border-red-500/30 hover:border-red-500/60 text-red-400 text-sm rounded-xl transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {isManual && post.status === 'manual' && (
        <div className="text-xs text-blue-400/80 bg-blue-500/10 rounded-xl p-3">
          📋 Conteúdo gerado — publicação manual necessária
        </div>
      )}
    </div>
  )
}

export default function RedesSociaisClient({ initialPosts }: { initialPosts: SocialPost[] }) {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts)
  const [generating, setGenerating] = useState(false)
  const [genMsg, setGenMsg] = useState('')

  function updatePost(id: string, newStatus: string) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus as SocialPost['status'] } : p))
  }

  async function handleGenerate() {
    setGenerating(true); setGenMsg('')
    const res = await fetch('/api/social/generate', { method: 'POST' })
    const data = await res.json()
    if (data.skipped) { setGenMsg('Conteúdo de hoje já foi gerado.') }
    else if (data.success) {
      const res2 = await fetch('/api/social/posts?today=true')
      const d2 = await res2.json()
      setPosts(d2.posts ?? [])
      setGenMsg(`✓ Gerado: "${data.theme}"`)
    }
    setGenerating(false)
  }

  const todayPosts = posts.filter((p) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return new Date(p.created_at) >= today
  })

  const historyPosts = posts.filter((p) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return new Date(p.created_at) < today
  })

  const pending = todayPosts.filter((p) => p.status === 'pending').length
  const posted = todayPosts.filter((p) => p.status === 'posted').length
  const theme = todayPosts[0]?.theme_title

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {theme && <p className="text-sm text-[#CBA35C]">Tema de hoje: <span className="text-white">{theme}</span></p>}
          <div className="flex gap-4 mt-2">
            <span className="text-sm text-amber-400">{pending} pendentes</span>
            <span className="text-sm text-emerald-400">{posted} publicados</span>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-[#CBA35C] hover:bg-[#E8C96A] disabled:opacity-50 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {generating ? 'Gerando...' : '✨ Gerar conteúdo de hoje'}
        </button>
      </div>

      {genMsg && <p className="text-sm text-[#CBA35C]">{genMsg}</p>}

      {/* Today's posts */}
      {todayPosts.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Hoje</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {todayPosts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={updatePost} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 border border-dashed border-white/10 rounded-2xl">
          <p className="text-4xl mb-3">📭</p>
          <p>Nenhum conteúdo gerado hoje.</p>
          <p className="text-sm mt-1">Clique em <strong className="text-[#CBA35C]">Gerar conteúdo de hoje</strong> para começar.</p>
        </div>
      )}

      {/* History */}
      {historyPosts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Histórico</h3>
          <div className="space-y-2">
            {historyPosts.map((post) => (
              <div key={post.id} className="bg-[#1a1a2e] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span>{PLATFORM_ICONS[post.platform]}</span>
                  <div>
                    <p className="text-sm text-white capitalize">{PLATFORM_LABELS[post.platform]}</p>
                    <p className="text-xs text-gray-400">{post.theme_title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLE[post.status] ?? STATUS_STYLE.pending}`}>
                    {STATUS_LABEL[post.status] ?? post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
