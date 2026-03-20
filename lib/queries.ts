import { cacheLife,cacheTag } from 'next/cache'

import { prisma } from './prisma'

export async function getProduct(id: string) {
  'use cache'
  cacheTag('products', `product-${id}`)
  cacheLife('seconds')
  return prisma.product.findUnique({ where: { id } })
}

export async function getProductBySlug(slug: string) {
  'use cache'
  cacheTag('products', `product-slug-${slug}`)
  cacheLife('seconds')
  return prisma.product.findUnique({ where: { slug } })
}

// 'use cache' persists across requests (replaces unstable_cache).
// Discount rarely changes — cache for 5 minutes with a revalidation tag.
export async function getDiscount() {
  'use cache'
  cacheTag('discount')
  cacheLife('minutes')          // built-in profile: revalidate every ~5 minutes
  return prisma.discount.findFirst()
}

export async function getProductsByType(type: string, category?: string) {
  'use cache'
  cacheTag('products')
  cacheLife('seconds')          // built-in profile: revalidate every ~60 seconds
  return prisma.product.findMany({
    where: { type, ...(category ? { category } : {}) },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, title: true, type: true, category: true,
      price: true, origin: true, avatar: true,
      color: true, material: true,
      wood: true, brand: true, windowBlinds: true,
    },
  })
}

export async function getProductsByTypePaginated(
  type: string,
  category?: string,
  cursor?: string,
  limit: number = 12,
) {
  'use cache'
  cacheTag('products')
  cacheLife('seconds')

  const where = { type, ...(category ? { category } : {}) }
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: limit + 1,
    select: {
      id: true, slug: true, title: true, type: true, category: true,
      price: true, origin: true, avatar: true,
      color: true, material: true,
      wood: true, brand: true, windowBlinds: true,
    },
  })

  let nextCursor: string | null = null
  if (products.length > limit) {
    const last = products.pop()
    nextCursor = last?.id ?? null
  }

  return { products, nextCursor }
}

export async function getFeaturedProducts() {
  'use cache'
  cacheTag('products')
  cacheLife('seconds')
  return prisma.product.findMany({
    where: { showOnHomePage: true },
    take: 32,
    select: {
      id: true, slug: true, title: true, type: true, category: true,
      price: true, avatar: true, origin: true,
    },
  })
}

export async function getSitemapProducts() {
  'use cache'
  cacheTag('products')
  cacheLife('minutes')
  return prisma.product.findMany({
    select: { slug: true, type: true, category: true, updatedAt: true },
  })
}

export async function getSimilarProducts(category: string, excludeId: string) {
  'use cache'
  cacheTag('products')
  cacheLife('seconds')
  return prisma.product.findMany({
    where: { category, id: { not: excludeId } },
    take: 4,
    select: { id: true, slug: true, title: true, type: true, category: true, avatar: true, price: true, origin: true },
  })
}

// Inferred return types — use as prop types in components
export type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number]
export type ProductListItem = Awaited<ReturnType<typeof getProductsByType>>[number]

// ── Admin queries ──────────────────────────────────────────────────────────────

export async function getAdminProducts() {
  'use cache'
  cacheTag('products')
  cacheLife('seconds')
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true, title: true, type: true, category: true,
      price: true, avatar: true, showOnHomePage: true,
    },
  })
}

export async function getPublishedProjects() {
  'use cache'
  cacheTag('projects')
  cacheLife('minutes')
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProjectBySlug(slug: string) {
  'use cache'
  cacheTag('projects', `project-slug-${slug}`)
  cacheLife('minutes')
  return prisma.project.findFirst({ where: { slug, published: true } })
}

export async function getAdminProjects() {
  'use cache'
  cacheTag('projects')
  cacheLife('seconds')
  return prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      roomType: true,
      avatar: true,
      published: true,
      createdAt: true,
    },
  })
}
// Admin discount page can reuse the public getDiscount() — same cache entry.

export async function getProductCount(type?: string, category?: string) {
  'use cache'
  cacheTag('products')
  cacheLife('minutes')
  return prisma.product.count({
    where: {
      ...(type ? { type } : {}),
      ...(category ? { category } : {}),
    },
  })
}

export async function getAdminInquiries() {
  'use cache'
  cacheTag('inquiries')
  cacheLife('seconds')
  return prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getAnalytics() {
  'use cache'
  cacheTag('products', 'inquiries', 'search-logs')
  cacheLife('minutes')

  const [productsByType, openInquiries, recentSearches] = await Promise.all([
    prisma.product.groupBy({ by: ['type'], _count: { _all: true } }),
    prisma.inquiry.count({ where: { status: 'OPEN' } }),
    prisma.searchLog.groupBy({
      by: ['query'],
      _count: { _all: true },
      orderBy: { _count: { query: 'desc' } },
      take: 10,
    }),
  ])

  return { productsByType, openInquiries, recentSearches }
}
