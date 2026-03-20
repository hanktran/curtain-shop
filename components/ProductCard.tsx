import Image from 'next/image'
import Link from 'next/link'

import { WishlistButton } from '@/components/WishlistButton'
import { catNames, formatPrice } from '@/lib/product-config'
import type { FeaturedProduct } from '@/lib/queries'

interface Props {
  product: FeaturedProduct
}

export function ProductCard({ product }: Props) {
  const href = `/${product.type}/${product.category}/${product.slug}`

  return (
    // article wraps both the Link and the WishlistButton so the heart button
    // is NOT nested inside the anchor — avoids invalid HTML + accessibility issues.
    <article className="group relative rounded-xl overflow-hidden border hover:border-brand/40 hover:shadow-lg transition-all duration-300 bg-card">
      {/* Wishlist heart — positioned in top-right, outside the Link */}
      <WishlistButton
        product={{
          id:       product.id,
          slug:     product.slug,
          type:     product.type,
          category: product.category,
          avatar:   product.avatar,
          title:    product.title,
          price:    product.price,
          origin:   product.origin,
        }}
        className="absolute top-2 right-2 z-20"
      />

      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-xl">
          <Image
            src={product.avatar || '/images/placeholder-product.jpg'}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Category label */}
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm leading-none">
              {catNames[product.category] ?? product.category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="bg-background/90 text-foreground text-xs font-medium px-3 py-1 rounded-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              Xem chi tiết
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 leading-snug">{product.title}</h3>
          <p className="text-sm font-semibold text-brand-warm mt-1.5">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}
