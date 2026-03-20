'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Heart } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import { type WishlistProduct, WISHLIST_KEY } from '@/components/WishlistButton'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistProduct[]>([])
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(WISHLIST_KEY)
    if (stored) {
      try { setProducts(JSON.parse(stored)) } catch { /* ignore corrupt storage */ }
    }
  }, [])

  function removeAll() {
    localStorage.removeItem(WISHLIST_KEY)
    setProducts([])
  }

  // Avoid SSR/hydration mismatch — render nothing until client mounts
  if (!mounted) return null

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Heart className="h-7 w-7 fill-red-500 stroke-red-500" aria-hidden="true" />
            Yêu thích
          </h1>
          {products.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{products.length} sản phẩm đã lưu</p>
          )}
        </div>
        {products.length > 0 && (
          <Button variant="outline" size="sm" onClick={removeAll}>
            Xóa tất cả
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground space-y-4">
          <Heart className="h-12 w-12 mx-auto stroke-muted-foreground/30" aria-hidden="true" />
          <p className="text-lg font-medium">Chưa có sản phẩm yêu thích</p>
          <p className="text-sm">Nhấn biểu tượng tim trên các sản phẩm để lưu vào đây.</p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/">Khám phá sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
