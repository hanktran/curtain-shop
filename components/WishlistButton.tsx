'use client'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

export const WISHLIST_KEY = 'ndd_wishlist'

export interface WishlistProduct {
  id:       string
  slug:     string | null
  type:     string
  category: string
  avatar:   string
  title:    string
  price:    string
  origin:   string
}

function readWishlist(): WishlistProduct[] {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]')
  } catch {
    return []
  }
}

interface Props {
  product: WishlistProduct
  className?: string
}

export function WishlistButton({ product, className = '' }: Readonly<Props>) {
  const [saved, setSaved] = useState(false)

  // Read initial state on mount (SSR-safe)
  useEffect(() => {
    setSaved(readWishlist().some(w => w.id === product.id))
  }, [product.id])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const list = readWishlist()
    const isIn = list.some(w => w.id === product.id)
    const updated = isIn ? list.filter(w => w.id !== product.id) : [...list, product]
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated))
    setSaved(!isIn)
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
      aria-pressed={saved}
      className={`flex items-center justify-center rounded-full w-7 h-7 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
    >
      <Heart
        className={`h-3.5 w-3.5 transition-colors ${
          saved ? 'fill-red-500 stroke-red-500' : 'stroke-white'
        }`}
        aria-hidden="true"
      />
    </button>
  )
}
