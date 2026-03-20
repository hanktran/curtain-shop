'use client'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import { loadMoreProducts } from '@/actions/product'
import { ProductCard } from '@/components/ProductCard'
import { colorOptions, materialOptions } from '@/lib/product-config'
import type { ProductListItem } from '@/lib/queries'

interface Props {
  products: ProductListItem[]
  nextCursor: string | null
  type: string
  category?: string
  totalCount: number
}

export function ProductListingGrid({
  products,
  nextCursor,
  type,
  category,
  totalCount,
}: Readonly<Props>) {
  const [loadedProducts, setLoadedProducts] = useState(products)
  const [cursor, setCursor] = useState(nextCursor)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all')

  // Extract numeric prices (stored as VND integer strings e.g. "1500000")
  const parsedPrices = loadedProducts
    .map(p => Number.parseInt(p.price.replaceAll(/\D/g, ''), 10))
    .filter(n => !Number.isNaN(n) && n > 0)

  const hasRange = parsedPrices.length >= 2
  const catalogMin = hasRange ? Math.min(...parsedPrices) : 0
  const catalogMax = hasRange ? Math.max(...parsedPrices) : 0
  const priceStep  = hasRange ? Math.max(1, Math.floor((catalogMax - catalogMin) / 100)) : 1

  const [minVal, setMinVal] = useState(catalogMin)
  const [maxVal, setMaxVal] = useState(catalogMax)
  const prevCatalogMinRef = useRef(catalogMin)
  const prevCatalogMaxRef = useRef(catalogMax)

  useEffect(() => {
    const prevCatalogMin = prevCatalogMinRef.current
    const prevCatalogMax = prevCatalogMaxRef.current

    setMinVal((prev) => {
      if (prev === prevCatalogMin) return catalogMin
      return Math.max(prev, catalogMin)
    })
    setMaxVal((prev) => {
      if (prev === prevCatalogMax) return catalogMax
      return Math.min(prev, catalogMax)
    })

    prevCatalogMinRef.current = catalogMin
    prevCatalogMaxRef.current = catalogMax
  }, [catalogMin, catalogMax])

  const filtered = useMemo(() => {
    return loadedProducts.filter((p) => {
      const price = Number.parseInt(p.price.replaceAll(/\D/g, ''), 10)
      const inPriceRange =
        !hasRange
        || (Number.isNaN(price) || price === 0)
        || (price >= minVal && price <= maxVal)

      const hasColor = selectedColor === 'all' || p.color.includes(selectedColor)
      const hasMaterial = selectedMaterial === 'all' || p.material.includes(selectedMaterial)

      return inPriceRange && hasColor && hasMaterial
    })
  }, [loadedProducts, minVal, maxVal, hasRange, selectedColor, selectedMaterial])

  const availableColors = useMemo(() => {
    const values = new Set<string>()
    for (const product of loadedProducts) {
      for (const color of product.color) values.add(color)
    }
    return Array.from(values)
  }, [loadedProducts])

  const availableMaterials = useMemo(() => {
    const values = new Set<string>()
    for (const product of loadedProducts) {
      for (const material of product.material) values.add(material)
    }
    return Array.from(values)
  }, [loadedProducts])

  const isDirty =
    minVal !== catalogMin
    || maxVal !== catalogMax
    || selectedColor !== 'all'
    || selectedMaterial !== 'all'

  function handleLoadMore() {
    if (!cursor) return
    setError(null)

    startTransition(async () => {
      try {
        const result = await loadMoreProducts(type, category, cursor)
        setLoadedProducts(prev => [...prev, ...result.products])
        setCursor(result.nextCursor)
      } catch {
        setError('Không thể tải thêm sản phẩm. Vui lòng thử lại.')
      }
    })
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        Hiển thị {loadedProducts.length} / {totalCount} sản phẩm
      </p>

      {/* Price range filter — only shown when catalog has varied prices */}
      {(hasRange && catalogMin < catalogMax) || availableColors.length > 0 || availableMaterials.length > 0 ? (
        <div className="mb-8 rounded-xl border bg-muted/30 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bộ lọc</span>
            {isDirty && (
              <button
                onClick={() => {
                  setMinVal(catalogMin)
                  setMaxVal(catalogMax)
                  setSelectedColor('all')
                  setSelectedMaterial('all')
                }}
                className="text-xs text-brand hover:underline"
              >
                Đặt lại
              </button>
            )}
          </div>

          {hasRange && catalogMin < catalogMax && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Lọc theo giá</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Từ</p>
                  <input
                    type="range"
                    min={catalogMin}
                    max={catalogMax}
                    value={minVal}
                    step={priceStep}
                    onChange={e => {
                      const v = Number(e.target.value)
                      if (v <= maxVal) setMinVal(v)
                    }}
                    className="w-full accent-brand"
                    aria-label="Giá tối thiểu"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Đến</p>
                  <input
                    type="range"
                    min={catalogMin}
                    max={catalogMax}
                    value={maxVal}
                    step={priceStep}
                    onChange={e => {
                      const v = Number(e.target.value)
                      if (v >= minVal) setMaxVal(v)
                    }}
                    className="w-full accent-brand"
                    aria-label="Giá tối đa"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
                <span>{minVal.toLocaleString('vi-VN')} VNĐ</span>
                <span className="text-foreground font-medium">{filtered.length} sản phẩm</span>
                <span>{maxVal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          )}

          {availableColors.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Màu sắc</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedColor('all')}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    selectedColor === 'all'
                      ? 'border-brand bg-brand text-white'
                      : 'hover:border-brand hover:text-brand'
                  }`}
                >
                  Tất cả
                </button>
                {availableColors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      selectedColor === color
                        ? 'border-brand bg-brand text-white'
                        : 'hover:border-brand hover:text-brand'
                    }`}
                  >
                    {colorOptions[color] ?? color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableMaterials.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Chất liệu</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMaterial('all')}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    selectedMaterial === 'all'
                      ? 'border-brand bg-brand text-white'
                      : 'hover:border-brand hover:text-brand'
                  }`}
                >
                  Tất cả
                </button>
                {availableMaterials.map((material) => (
                  <button
                    type="button"
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      selectedMaterial === material
                        ? 'border-brand bg-brand text-white'
                        : 'hover:border-brand hover:text-brand'
                    }`}
                  >
                    {materialOptions[material] ?? material}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Không có sản phẩm trong khoảng giá này.</p>
          <button
            onClick={() => { setMinVal(catalogMin); setMaxVal(catalogMax) }}
            className="mt-3 text-sm text-brand hover:underline"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {cursor && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending && (
                  <span
                    aria-hidden
                    className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                  />
                )}
                {isPending ? 'Đang tải...' : 'Xem thêm'}
              </button>
            </div>
          )}

          {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}
        </>
      )}
    </>
  )
}
