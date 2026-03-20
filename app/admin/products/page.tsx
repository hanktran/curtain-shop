import Link from 'next/link'
import { connection } from 'next/server'

import type { Metadata } from 'next'

import { AdminProductsTable } from '@/components/admin/AdminProductsTable'
import { Button } from '@/components/ui/button'
import { getAdminProducts } from '@/lib/queries'

export const metadata: Metadata = { title: 'Quản lý sản phẩm' }


export default async function AdminProductsPage() {
  await connection()
  const products = await getAdminProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Sản phẩm
          <span className="inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {products.length}
          </span>
        </h1>
        <Link href="/admin/add-product">
          <Button>Thêm sản phẩm</Button>
        </Link>
      </div>

      <AdminProductsTable products={products} />
    </div>
  )
}
