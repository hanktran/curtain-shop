'use server'
import { cacheLife, cacheTag } from 'next/cache'

import { prisma } from '@/lib/prisma'

export type SearchResult = { label: string; href: string }

// Inner cached fetch — result is memoized per unique query string.
async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  'use cache'
  cacheTag('products')
  cacheLife('minutes')

  const products = await prisma.product.findMany({
    where: query.trim()
      ? { title: { contains: query.trim(), mode: 'insensitive' } }
      : undefined,
    select: { id: true, slug: true, title: true, type: true, category: true },
    take: 20,
  })
  return products.map((p) => ({
    label: p.title,
    href:  `/${p.type}/${p.category}/${p.slug}`,
  }))
}

// Exposed server action — runs on every call to log the query,
// but delegates the actual DB fetch to the cached inner function.
export async function searchProducts(query: string): Promise<SearchResult[]> {
  const q = query.trim()
  if (!q) return []

  const results = await fetchSearchResults(q)

  // Fire-and-forget log (non-blocking, errors silently swallowed)
  prisma.searchLog.create({
    data: { query: q, resultCount: results.length },
  }).catch((e) => console.error('[searchProducts] log failed', e))

  return results
}
