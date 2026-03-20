import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Phone } from 'lucide-react'
import type { Metadata } from 'next'

import { InquiryForm } from '@/components/InquiryForm'
import { ProductCard } from '@/components/ProductCard'
import { ProductGallery } from '@/components/ProductGallery'
import { ShareButtons } from '@/components/ShareButtons'
import { Button } from '@/components/ui/button'
import { categories, catNames, formatOrigins, formatPrice, getBreadcrumbs, typeNames, types } from '@/lib/product-config'
import type { FeaturedProduct } from '@/lib/queries'
import { getProductBySlug, getSimilarProducts } from '@/lib/queries'
import { siteConfig } from '@/lib/site-config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://noithatdaiduong.net.vn'
interface Props {
  params: Promise<{ productType: string; productCat: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productType, productCat, slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  const catName = catNames[productCat] ?? productCat
  return {
    title: product.title,
    description: `${catName} | ${product.title} — chất lượng cao tại Nội thất Đại Dương.`,
    openGraph: {
      type: 'website',
      title: product.title,
      description: `${catName} | ${product.title}`,
      url: `${siteUrl}/${productType}/${productCat}/${slug}`,
      images: [{ url: product.images[0], width: 1200, height: 630 }],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: `${catName} | ${product.title}`,
      images: [product.images[0]],
    },
  }
}


export default async function ProductDetailPage({ params }: Props) {
  const { productType, productCat, slug } = await params

  if (!types.includes(productType as (typeof types)[number])) notFound()
  if (!categories.includes(productCat)) notFound()

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const similar = await getSimilarProducts(product.category, product.id)

  const breadcrumbs = getBreadcrumbs(productType, productCat, product.title)
  const origins     = formatOrigins(product.origin)
  const productUrl  = `${siteUrl}/${productType}/${productCat}/${slug}`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: `${catNames[productCat] ?? productCat} | ${product.title}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: isNaN(Number(product.price)) ? undefined : product.price,
      availability: 'https://schema.org/InStock',
      url: productUrl,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: typeNames[productType as keyof typeof typeNames] ?? productType, item: `${siteUrl}/${productType}` },
      { '@type': 'ListItem', position: 3, name: catNames[productCat] ?? productCat, item: `${siteUrl}/${productType}/${productCat}` },
      { '@type': 'ListItem', position: 4, name: product.title },
    ],
  }

  const specs: { label: string; value: string }[] = [
    { label: 'Danh mục', value: typeNames[productType as keyof typeof typeNames] ?? productType },
    { label: 'Loại',     value: catNames[productCat] ?? productCat },
    { label: 'Xuất xứ',  value: origins.map((o) => o.name).join(', ') },
    ...(product.wood         ? [{ label: 'Loại gỗ',     value: product.wood }]         : []),
    ...(product.brand        ? [{ label: 'Thương hiệu', value: product.brand }]        : []),
    ...(product.windowBlinds ? [{ label: 'Màn sáo',     value: product.windowBlinds }] : []),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-8 flex flex-wrap gap-1">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-brand transition-colors">
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.name}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Image gallery with lightbox */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.title}</h1>
              <p className="text-2xl font-bold text-brand-warm mt-2">{formatPrice(product.price)}</p>
            </div>

            {/* Specs table */}
            <dl className="divide-y rounded-xl border overflow-hidden text-sm">
              {specs.map(({ label, value }) => (
                <div key={label} className="flex px-4 py-2.5">
                  <dt className="w-24 sm:w-32 shrink-0 text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            {/* CTA */}
            <div className="pt-2 space-y-3">
              {siteConfig.phone && (
                <Button asChild size="lg" className="w-full gap-2 bg-brand-warm text-brand-warm-foreground hover:bg-brand-warm/90 border-0">
                  <a href={`tel:${siteConfig.phone}`}>
                    <Phone className="h-4 w-4" />
                    Liên hệ để đặt hàng
                  </a>
                </Button>
              )}
              <p className="text-xs text-center text-muted-foreground">
                Gọi ngay để được tư vấn miễn phí và báo giá nhanh nhất
              </p>
            </div>

            {/* Social sharing */}
            <ShareButtons title={product.title} url={productUrl} />

            {/* Lead capture */}
            <InquiryForm productId={product.id} productTitle={product.title} />
          </div>
        </div>

        {/* Similar products */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.slice(0, 4).map((p: FeaturedProduct) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile CTA */}
      {siteConfig.phone && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t px-4 py-3 shadow-lg">
          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-brand text-white font-semibold py-3 text-sm active:opacity-80 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            Gọi ngay để đặt hàng
          </a>
        </div>
      )}
    </>
  )
}
