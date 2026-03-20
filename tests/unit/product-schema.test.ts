import { describe, expect, it } from 'vitest'

import { productSchema } from '@/lib/product-schema'

const validProduct = {
  title: 'Deluxe Curtain',
  slug: 'deluxe-curtain',
  type: 'curtains-blinds',
  category: 'fabric-curtains',
  price: '1500000',
  origin: 'viet-nam',
  color: ['white'],
  material: ['fabric'],
  showOnHomePage: true,
  images: ['https://example.com/image-1.jpg'],
  wood: 'oak',
  brand: 'Acme',
  windowBlinds: 'roller',
}

describe('productSchema', () => {
  it('passes validation for valid product data', () => {
    const result = productSchema.safeParse(validProduct)
    expect(result.success).toBe(true)
  })

  it('fails when required fields are missing', () => {
    const { title: _title, ...missingTitle } = validProduct
    const result = productSchema.safeParse(missingTitle)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'title')).toBe(true)
    }
  })

  it('fails when type is invalid', () => {
    const result = productSchema.safeParse({
      ...validProduct,
      type: 'invalid-type',
    })
    expect(result.success).toBe(false)
  })

  it('fails when category does not belong to selected type', () => {
    const result = productSchema.safeParse({
      ...validProduct,
      type: 'wallpaper',
      category: 'carpet',
    })
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'category')).toBe(true)
    }
  })

  it('fails for edge-case invalid values (empty strings and very long slug)', () => {
    const veryLongSlug = 'a'.repeat(201)
    const result = productSchema.safeParse({
      ...validProduct,
      title: '',
      slug: veryLongSlug,
      price: '',
      origin: '',
      images: [],
    })
    expect(result.success).toBe(false)

    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0])
      expect(paths).toContain('title')
      expect(paths).toContain('slug')
      expect(paths).toContain('price')
      expect(paths).toContain('origin')
      expect(paths).toContain('images')
    }
  })
})