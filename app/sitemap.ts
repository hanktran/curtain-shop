import type { MetadataRoute } from 'next'

import { categoriesByType,types } from '@/lib/product-config'
import { getPublishedProjects, getSitemapProducts } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, projects] = await Promise.all([
    getSitemapProducts(),
    getPublishedProjects(),
  ])

  const base = process.env.NEXT_PUBLIC_SITE_URL!
  const now  = new Date()

  // Product type listing pages: /curtains-blinds, /flooring, …
  const typePages: MetadataRoute.Sitemap = types.map((type) => ({
    url:             `${base}/${type}`,
    changeFrequency: 'weekly',
    lastModified:    now,
  }))

  // Category listing pages: /curtains-blinds/fabric-curtains, …
  const categoryPages: MetadataRoute.Sitemap = Object.entries(categoriesByType).flatMap(
    ([type, cats]) =>
      cats.map((cat) => ({
        url:             `${base}/${type}/${cat}`,
        changeFrequency: 'weekly' as const,
        lastModified:    now,
      }))
  )

  return [
    { url: `${base}/`,         changeFrequency: 'weekly',  lastModified: now },
    { url: `${base}/about`,    changeFrequency: 'monthly', lastModified: now },
    { url: `${base}/projects`, changeFrequency: 'monthly', lastModified: now },
    ...typePages,
    ...categoryPages,
    ...products.filter((p) => p.slug).map((p) => ({
      url:             `${base}/${p.type}/${p.category}/${p.slug}`,
      changeFrequency: 'monthly' as const,
      lastModified:    p.updatedAt,
    })),
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      changeFrequency: 'monthly' as const,
      lastModified: project.updatedAt,
    })),
  ]
}
