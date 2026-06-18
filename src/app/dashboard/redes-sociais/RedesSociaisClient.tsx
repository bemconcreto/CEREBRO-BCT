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

// Handles both old nested format {telegram:{text:...}} and new flat format {text:...}
function getPlatformData(post: SocialPost): Record<string, unknown> {
  const c = post.content
  if (c[post.platform] && typeof c[post.platform] === 'object') {
    return c[post.platform] as Record<string, unknown>
  }
  return c
}

function getMainText(post: SocialPost): string {
  const d = getPlatformData(post)
  if (post.platform === 'telegram') return String(d.text ?? '').replace(/<[^>]+>/g, '')
  if (post.platform === 'discord') return String(d.description ?? '')
  if (post.platform === 'instagram') return String(d.caption ?? '')
  if (post.platform === 'facebook') return String(d.text ?? '')
  if (post.platform === 'youtube') return `${d.title ?? ''}\n\n${d.description ?? ''}`
  if (post.platform === 'tiktok') return `${d.caption ?? ''}`
  return ''
}

function getEditableText(post: SocialPost): string {
  const d = getPlatformData(post)
  if (post.platform === 'telegram') return String(d.text ?? '')
  if (post.platform === 'discord') return String(d.description ?? '')
  if (post.platform === 'instagram') return String(d.caption ?? '')
  if (post.platform === 'facebook') return String(d.text ?? '')
  if (post.platform === 'youtube') return String(d.description ?? '')
  if (post.platform === 'tiktok') return String(d.caption ?? '')
  return ''
}

function buildUpdatedContent(post: SocialPost, newText: string): Record<string, unknown> {
  const d = { ...getPlatformData(post) }
  if (post.platform === 'telegram') d.text = newText
  else if (post.platform === 'discord') d.description = newText
  else if (post.platform === 'instagram') d.caption = newText
  else if (post.platform === 'facebook') d.text = newText
  else if (post.platform === 'youtube') d.description = newText
  else if (post.platform === 'tiktok') d.caption = newText
  return d
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
    >
      {copied ? '✓ Copiado!' : `📋 ${label}`}
    </button>
  )
}

function ImageBlock({ url }: { url: string }) {
  return (
    <div className="space-y-2">
      <img src={url} alt="" className="w-full h-36 object-cover rounded-xl" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-[#101820] bg-gray-100 hover:bg-gray-200 rounded-lg py-1.5 transition-colors font-medium"
      >
        ⬇ Baixar imagem
      </a>
    </div>
  )
}

function ManualCard({ post }: { post: SocialPost }) {
  const d = getPlatformData(post)
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

      {post.image_url && <ImageBlock url={post.image_url} />}

      {isYouTube ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Título</p>
            <p className="text-sm text-[#101820] font-medium">{String(d.title ?? '')}</p>
            <div className="mt-1.5"><CopyButton text={String(d.title ?? '')} label="Copiar título" /></div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Descrição</p>
            <div className="max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{String(d.description ?? '')}</p>
            </div>
            <div className="mt-1.5"><CopyButton text={String(d.description ?? '')} label="Copiar descrição" /></div>
          </div>
          {Array.isArray(d.tags) && (
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Tags</p>
              <p className="text-xs text-gray-500">{(d.tags as string[]).join(', ')}</p>
              <div className="mt-1.5"><CopyButton text={(d.tags as string[]).join(', ')} label="Copiar tags" /></div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Roteiro do Vídeo</p>
            <div className="max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{String(d.script ?? '')}</p>
            </div>
            <div className="mt-1.5"><CopyButton text={String(d.script ?? '')} label="Copiar roteiro" /></div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Legenda</p>
            <div className="max-h-24 overflow-y-auto">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{String(d.caption ?? '')}</p>
            </div>
            <div className="mt-1.5 flex gap-2 flex-wrap">
              <CopyButton text={String(d.caption ?? '')} label="Copiar legenda" />
              {Array.isArray(d.hashtags) && (
                <CopyButton text={(d.hashtags as string[]).map((h) => `#${h}`).join(' ')} label="Copiar hashtags" />
              )}
            </div>
          </div>
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
  const [editText, setEditText] = useState('')
  const [error, setError] = useState('')

  const isManual = post.platform === 'youtube' || post.platform === 'tiktok'
  if (isManual) return <ManualCard post={post} />

  const canAct = post.status === 'pending' || post.status === 'failed'
  const mainText = getMainText(post)
  const d = getPlatformData(post)

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

  function startEdit() {
    setEditText(getEditableText(post))
    setEditing(true)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[post.platform]}</span>
          <span className="font-semibold text-[#101820]">{PLATFORM_LABELS[post.platform]}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[post.status] ?? STATUS_STYLE.pending}`}>
          {STATUS_LABEL[post.status] ?? post.status}
        </span>
      </div>

      {/* Image */}
      {post.image_url && <ImageBlock url={post.image_url} />}

      {/* Content */}
      {editing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-[#101820] resize-none"
          rows={7}
        />
      ) : (
        <div className="space-y-2">
          {/* Main text */}
          <div className="max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {mainText || <span className="text-gray-400 italic">Sem conteúdo</span>}
            </p>
          </div>
          {/* Hashtags */}
          {Array.isArray(d.hashtags) && (d.hashtags as string[]).length > 0 && (
            <p className="text-xs text-[#8D6E63] line-clamp-2">
              {(d.hashtags as string[]).map((h) => `#${h}`).join(' ')}
            </p>
          )}
          {/* Copy buttons */}
          <div className="flex gap-2 flex-wrap pt-1">
            <CopyButton text={mainText} label="Copiar texto" />
            {Array.isArray(d.hashtags) && (d.hashtags as string[]).length > 0 && (
              <CopyButton text={(d.hashtags as string[]).map((h) => `#${h}`).join(' ')} label="Copiar hashtags" />
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{error}</p>}

      {/* Actions */}
      {canAct && (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 bg-[#CBA35C] hover:bg-[#b8924e] disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            {loading ? '⟳ Publicando...' : editing ? 'Salvar e Publicar' : '✓ Aprovar e Publicar'}
          </button>
          <button
            onClick={editing ? () => setEditing(false) : startEdit}
            title={editing ? 'Cancelar edição' : 'Editar'}
            className="px-3 py-2 border border-gray-300 hover:border-gray-400 text-gray-600 text-sm rounded-xl transition-colors"
          >
            {editing ? '✕' : '✏️'}
          </button>
          {!editing && (
            <button
              onClick={handleReject}
              disabled={loading}
              title="Rejeitar"
              className="px-3 py-2 border border-red-200 hover:border-red-400 text-red-500 text-sm rounded-xl transition-colors"
            >
              🗑
            </button>
          )}
        </div>
      )}

      {(post.status === 'posted' || post.status === 'rejected') && (
        <div className={`text-xs rounded-xl p-2.5 text-center font-medium ${post.status === 'posted' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 bg-gray-50'}`}>
          {post.status === 'posted' ? '✓ Publicado com sucesso' : '— Rejeitado'}
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
      setGenMsg('⚠️ Conteúdo de hoje já foi gerado.')
    } else if (data.success) {
      const res2 = await fetch('/api/social/posts?today=true')
      const d2 = await res2.json()
      setPosts(d2.posts ?? [])
      setGenMsg(`✓ Gerado com sucesso: "${data.theme}"`)
    } else {
      setGenMsg('✗ Erro ao gerar conteúdo.')
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
      {/* Stats + Gerar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          {theme && (
            <p className="text-sm">
              <span className="text-[#8D6E63] font-medium">Tema de hoje: </span>
              <span className="text-[#101820] font-semibold">{theme}</span>
            </p>
          )}
          <div className="flex gap-4 mt-1.5">
            {pending > 0 && <span className="text-sm text-amber-600 font-medium">{pending} pendente{pending > 1 ? 's' : ''}</span>}
            {posted > 0 && <span className="text-sm text-emerald-600 font-medium">{posted} publicado{posted > 1 ? 's' : ''}</span>}
            {pending === 0 && posted === 0 && <span className="text-sm text-gray-400">Nenhum post hoje</span>}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="shrink-0 bg-[#101820] hover:bg-[#1e2d3d] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {generating ? '⟳ Gerando...' : '✨ Gerar conteúdo de hoje'}
        </button>
      </div>

      {genMsg && (
        <p className={`text-sm font-medium px-4 py-2.5 rounded-xl ${
          genMsg.startsWith('✓') ? 'text-emerald-700 bg-emerald-50' :
          genMsg.startsWith('✗') ? 'text-red-700 bg-red-50' :
          'text-amber-700 bg-amber-50'
        }`}>
          {genMsg}
        </p>
      )}

      {/* Today */}
      {todayPosts.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Hoje</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {todayPosts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={updatePost} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium text-gray-700">Nenhum conteúdo gerado hoje.</p>
          <p className="text-sm text-gray-400 mt-1">Clique em <strong className="text-[#101820]">Gerar conteúdo de hoje</strong> para começar.</p>
        </div>
      )}

      {/* History */}
      {historyPosts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Histórico</p>
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
                <div className="flex items-center gap-3 shrink-0">
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
