import type { Metadata } from 'next'

import { ProductForm } from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'Thêm sản phẩm' }

export default function AddProductPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <ProductForm />
    </div>
  )
}
