export async function getRealEstateImage(keywords: string[]): Promise<string | undefined> {
  const query = keywords.join(' ')
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`

  try {
    const res = await fetch(url, {
      headers: { Authorization: process.env.PEXELS_API_KEY! },
    })
    const data = await res.json()
    const photos = data.photos ?? []
    if (!photos.length) return undefined
    const photo = photos[Math.floor(Math.random() * photos.length)]
    return photo.src?.large2x
  } catch {
    return undefined
  }
}
