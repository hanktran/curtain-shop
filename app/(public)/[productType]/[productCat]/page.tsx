import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Metadata } from 'next'

import { ProductListingGrid } from '@/components/ProductListingGrid'
import { categories, categoriesByType, catNames, typeNames, types } from '@/lib/product-config'
import { getProductCount, getProductsByTypePaginated } from '@/lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://noithatdaiduong.net.vn'

interface Props {
  params: Promise<{ productType: string; productCat: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productType, productCat } = await params
  const typeName = typeNames[productType as keyof typeof typeNames]
  const catName  = catNames[productCat]
  if (!typeName || !catName) return {}
  return {
    title: catName,
    description: `${typeName} | ${catName} — chất lượng cao, giá cả hợp lý tại Nội thất Đại Dương.`,
  }
}

export function generateStaticParams() {
  return Object.entries(categoriesByType).flatMap(([productType, cats]) =>
    cats.map((productCat) => ({ productType, productCat }))
  )
}

export default async function ProductCatPage({ params }: Props) {
  const { productType, productCat } = await params

  if (!types.includes(productType as (typeof types)[number])) notFound()
  if (!categories.includes(productCat)) notFound()

  const [{ products, nextCursor }, totalCount] = await Promise.all([
    getProductsByTypePaginated(productType, productCat),
    getProductCount(productType, productCat),
  ])
  const cats      = categoriesByType[productType as keyof typeof categoriesByType] ?? []
  const typeName  = typeNames[productType as keyof typeof typeNames]
  const catName   = catNames[productCat]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: typeName, item: `${siteUrl}/${productType}` },
      { '@type': 'ListItem', position: 3, name: catName },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href={`/${productType}`} className="hover:text-brand transition-colors">
              {typeName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{catName}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{catName}</h1>
          <p className="text-muted-foreground mt-2">
            {typeName} · {catName} — chất lượng cao, tư vấn miễn phí tại nhà.
          </p>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{totalCount} sản phẩm</p>
          )}
        </div>

        {/* Category filter pills */}
        {cats.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/${productType}`}
              className="px-4 py-1.5 rounded-full bg-muted border text-sm hover:border-brand hover:text-brand transition-colors"
            >
              Tất cả
            </Link>
            {cats.map((cat) => (
              <Link
                key={cat}
                href={`/${productType}/${cat}`}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  cat === productCat
                    ? 'bg-brand text-white'
                    : 'bg-muted border hover:border-brand hover:text-brand'
                }`}
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
            key={`${productType}/${productCat}`}
            products={products}
            nextCursor={nextCursor}
            type={productType}
            category={productCat}
            totalCount={totalCount}
          />
        )}
      </div>
    </>
  )
}
