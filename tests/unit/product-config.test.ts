import { describe, expect, it } from 'vitest'

import { formatOrigins, formatPrice, getBreadcrumbs } from '@/lib/product-config'

describe('product-config utilities', () => {
  describe('formatPrice', () => {
    it('formats numeric strings with thousands separators and VNĐ suffix', () => {
      expect(formatPrice('1000')).toBe('1.000 VNĐ')
      expect(formatPrice('1000000')).toBe('1.000.000 VNĐ')
    })

    it('returns non-numeric strings unchanged', () => {
      expect(formatPrice('Liên hệ')).toBe('Liên hệ')
      expect(formatPrice('not-a-number')).toBe('not-a-number')
    })

    it('handles edge-case numeric-like input as implemented', () => {
      expect(formatPrice('0')).toBe('0 VNĐ')
      expect(formatPrice('')).toBe(' VNĐ')
    })
  })

  describe('formatOrigins', () => {
    it('maps known origin slugs to display names', () => {
      expect(formatOrigins('viet-nam,thai-lan')).toEqual([
        { origin: 'viet-nam', name: 'Việt Nam' },
        { origin: 'thai-lan', name: 'Thái Lan' },
      ])
    })

    it('falls back to slug when origin is unknown', () => {
      expect(formatOrigins('mars')).toEqual([{ origin: 'mars', name: 'mars' }])
    })

    it('handles empty input string', () => {
      expect(formatOrigins('')).toEqual([{ origin: '', name: '' }])
    })
  })

  describe('getBreadcrumbs', () => {
    it('builds full breadcrumb trail for normal type/category with product title', () => {
      expect(getBreadcrumbs('curtains-blinds', 'fabric-curtains', 'Sample Product')).toEqual([
        { href: '/', name: 'Trang chủ' },
        { href: '/curtains-blinds', name: 'Màn vải - Màn sáo' },
        { href: '/curtains-blinds/fabric-curtains', name: 'Màn vải' },
        { name: 'Sample Product' },
      ])
    })

    it('omits category crumb for 3d-art type', () => {
      expect(getBreadcrumbs('3d-art', '3d-art')).toEqual([
        { href: '/', name: 'Trang chủ' },
        { href: '/3d-art', name: 'Tranh 3D' },
      ])
    })

    it('falls back to raw type/category values for unknown slugs', () => {
      expect(getBreadcrumbs('unknown-type', 'unknown-category')).toEqual([
        { href: '/', name: 'Trang chủ' },
        { href: '/unknown-type', name: 'unknown-type' },
        { href: '/unknown-type/unknown-category', name: 'unknown-category' },
      ])
    })
  })
})