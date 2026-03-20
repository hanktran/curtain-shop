import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import type { Metadata } from 'next'

import { ProductForm } from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Chỉnh sửa sản phẩm' }

interface Props {
  params: Promise<{ productId: string }>
}

export default async function EditProductPage({ params }: Props) {
  await connection()
  const { productId } = await params
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) notFound()

  return (
    <div className="max-w-5xl mx-auto">
      {/* key={product.id} forces a full remount when navigating between products,
          resetting all useState initializers to the new product's values. */}
      <ProductForm key={product.id} product={product} />
    </div>
  )
}
