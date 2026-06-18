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
  pending: 'bg-amber-100 text-amber-700 border border-amber-300',
  posted: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
  failed: 'bg-red-100 text-red-700 border border-red-300',
  rejected: 'bg-gray-100 text-gray-500 border border-gray-300',
  manual: 'bg-blue-100 text-blue-700 border border-blue-300',
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
  if (post.platform === 'youtube') return String(c.title ?? '')
  if (post.platform === 'tiktok') return String(c.caption ?? '').slice(0, 200)
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

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs px-3 py-1.5 bg-[#101820]/10 hover:bg-[#101820]/20 text-[#101820] rounded-lg transition-colors font-medium"
    >
      {copied ? '✓ Copiado' : `📋 ${label}`}
    </button>
  )
}

function ManualCard({ post }: { post: SocialPost }) {
  const c = post.content
  const isYouTube = post.platform === 'youtube'

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[post.platform]}</span>
          <span className="font-semibold text-[#101820]">{PLATFORM_LABELS[post.platform]}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[post.status]}`}>
          {STATUS_LABEL[post.status]}
        </span>
      </div>

      {post.image_url && (
        <div className="relative group">
          <img src={post.image_url} alt="" className="w-full h-36 object-cover rounded-xl" />
          <a
            href={post.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
          >
            <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1.5 rounded-lg">⬇ Abrir imagem</span>
          </a>
        </div>
      )}

      {isYouTube ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">TÍTULO</p>
            <p className="text-sm text-[#101820] font-semibold">{String(c.title ?? '')}</p>
            <div className="mt-1"><CopyButton text={String(c.title ?? '')} label="Copiar título" /></div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">DESCRIÇÃO</p>
            <p className="text-sm text-gray-600 line-clamp-3">{String(c.description ?? '')}</p>
            <div className="mt-1"><CopyButton text={String(c.description ?? '')} label="Copiar descrição" /></div>
          </div>
          {Array.isArray(c.tags) && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">TAGS</p>
              <p className="text-xs text-gray-500 line-clamp-2">{(c.tags as string[]).join(', ')}</p>
              <div className="mt-1"><CopyButton text={(c.tags as string[]).join(', ')} label="Copiar tags" /></div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">ROTEIRO DO VÍDEO</p>
            <p className="text-sm text-gray-600 line-clamp-4">{String(c.script ?? '')}</p>
            <div className="mt-1"><CopyButton text={String(c.script ?? '')} label="Copiar roteiro" /></div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">LEGENDA</p>
            <p className="text-sm text-gray-600 line-clamp-2">{String(c.caption ?? '')}</p>
            <div className="mt-1"><CopyButton text={String(c.caption ?? '')} label="Copiar legenda" /></div>
          </div>
          {Array.isArray(c.hashtags) && (
            <div>
              <CopyButton
                text={(c.hashtags as string[]).map((h) => `#${h}`).join(' ')}
                label="Copiar hashtags"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
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
  if (isManual) return <ManualCard post={post} />

  const canAct = post.status === 'pending' || post.status === 'failed'

  async function handleApprove() {
    setLoading(true); setError('')
    try {
      if (editing) {
        await fetch(`/api/social/posts/${post.id}/edit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: buildUpdatedContent(post, editText) }),
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
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[post.platform]}</span>
          <span className="font-semibold text-[#101820]">{PLATFORM_LABELS[post.platform]}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[post.status] ?? STATUS_STYLE.pending}`}>
          {STATUS_LABEL[post.status] ?? post.status}
        </span>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full h-32 object-cover rounded-xl" />
      )}

      {editing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-[#101820] resize-none"
          rows={6}
        />
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{getPreviewText(post)}…</p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {post.status === 'posted' && (
        <div className="text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3 text-center">
          ✓ Publicado com sucesso
        </div>
      )}

      {post.status === 'rejected' && (
        <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 text-center">
          — Rejeitado
        </div>
      )}

      {canAct && (
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 bg-[#CBA35C] hover:bg-[#b8924e] disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            {loading ? '...' : editing ? 'Salvar e Publicar' : '✓ Aprovar e Publicar'}
          </button>
          <button
            onClick={() => { setEditing(!editing); setEditText(getEditableText(post)) }}
            title="Editar"
            className="px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-600 text-sm rounded-xl transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            title="Rejeitar"
            className="px-3 py-2 border border-red-200 hover:border-red-400 text-red-500 text-sm rounded-xl transition-colors"
          >
            ✕
          </button>
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
    if (data.skipped) {
      setGenMsg('Conteúdo de hoje já foi gerado.')
    } else if (data.success) {
      const res2 = await fetch('/api/social/posts?today=true')
      const d2 = await res2.json()
      setPosts(d2.posts ?? [])
      setGenMsg(`✓ Gerado: "${data.theme}"`)
    }
    setGenerating(false)
  }

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const todayPosts = posts.filter((p) => new Date(p.created_at) >= today)
  const historyPosts = posts.filter((p) => new Date(p.created_at) < today)

  const pending = todayPosts.filter((p) => p.status === 'pending').length
  const posted = todayPosts.filter((p) => p.status === 'posted').length
  const theme = todayPosts[0]?.theme_title

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {theme && (
            <p className="text-sm font-medium">
              <span className="text-[#8D6E63]">Tema de hoje: </span>
              <span className="text-[#101820]">{theme}</span>
            </p>
          )}
          <div className="flex gap-4 mt-2">
            {pending > 0 && <span className="text-sm text-amber-600 font-medium">{pending} pendentes</span>}
            {posted > 0 && <span className="text-sm text-emerald-600 font-medium">{posted} publicados</span>}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-[#101820] hover:bg-[#1a2a3a] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          {generating ? (
            <><span className="animate-spin">⟳</span> Gerando...</>
          ) : (
            <>✨ Gerar conteúdo de hoje</>
          )}
        </button>
      </div>

      {genMsg && (
        <p className={`text-sm font-medium ${genMsg.startsWith('✓') ? 'text-emerald-600' : 'text-amber-600'}`}>
          {genMsg}
        </p>
      )}

      {/* Today's posts */}
      {todayPosts.length > 0 ? (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Hoje</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {todayPosts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={updatePost} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium text-gray-600">Nenhum conteúdo gerado hoje.</p>
          <p className="text-sm mt-1">Clique em <strong className="text-[#101820]">Gerar conteúdo de hoje</strong> para começar.</p>
        </div>
      )}

      {/* History */}
      {historyPosts.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Histórico</h3>
          <div className="space-y-2">
            {historyPosts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span>{PLATFORM_ICONS[post.platform]}</span>
                  <div>
                    <p className="text-sm font-medium text-[#101820]">{PLATFORM_LABELS[post.platform]}</p>
                    <p className="text-xs text-gray-400">{post.theme_title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
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
