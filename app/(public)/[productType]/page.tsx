import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Metadata } from 'next'

import { ProductListingGrid } from '@/components/ProductListingGrid'
import { categoriesByType, catNames, typeDescriptions, typeNames, types } from '@/lib/product-config'
import { getProductCount, getProductsByTypePaginated } from '@/lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://noithatdaiduong.net.vn'

interface Props {
  params: Promise<{ productType: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productType } = await params
  const name = typeNames[productType as keyof typeof typeNames]
  if (!name) return {}
  return {
    title: name,
    description: `Nội thất Đại Dương | ${name} — khám phá bộ sưu tập đa dạng, chất lượng cao.`,
  }
}

export function generateStaticParams() {
  return types.map((productType) => ({ productType }))
}

export default async function ProductTypePage({ params }: Props) {
  const { productType } = await params

  if (!types.includes(productType as (typeof types)[number])) notFound()

  const [{ products, nextCursor }, totalCount] = await Promise.all([
    getProductsByTypePaginated(productType),
    getProductCount(productType),
  ])
  const cats        = categoriesByType[productType as keyof typeof categoriesByType] ?? []
  const typeName    = typeNames[productType as keyof typeof typeNames]
  const typeDesc    = typeDescriptions[productType as keyof typeof typeDescriptions]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: typeName },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{typeName}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{typeName}</h1>
          {typeDesc && <p className="text-muted-foreground mt-2 max-w-2xl">{typeDesc}</p>}
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{totalCount} sản phẩm</p>
          )}
        </div>

        {/* Category filter pills */}
        {cats.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-brand text-white">
              Tất cả
            </span>
            {cats.map((cat) => (
              <Link
                key={cat}
                href={`/${productType}/${cat}`}
                className="px-4 py-1.5 rounded-full bg-muted border text-sm hover:border-brand hover:text-brand transition-colors"
              >
                {catNames[cat]}
              </Link>
            ))}
          </div>
        )}

        {totalCount === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>Chưa có sản phẩm trong danh mục này.</p>
          </div>
        ) : (
          <ProductListingGrid
            key={productType}
            products={products}
            nextCursor={nextCursor}
            type={productType}
            totalCount={totalCount}
          />
        )}
      </div>
    </>
  )
}
