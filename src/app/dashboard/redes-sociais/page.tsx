import { getPosts } from '@/lib/social/supabase'
import RedesSociaisClient from './RedesSociaisClient'

export const dynamic = 'force-dynamic'

export default async function RedesSociaisPage() {
  const posts = await getPosts(60)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#101820]">Redes Sociais</h1>
        <p className="text-gray-500 text-sm mt-1">Geração e aprovação de conteúdo diário para todas as plataformas</p>
      </div>
      <RedesSociaisClient initialPosts={posts} />
    </div>
  )
}
