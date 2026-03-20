import { connection } from 'next/server'

import type { Metadata } from 'next'

import { DiscountForm } from '@/components/admin/DiscountForm'
import { getDiscount } from '@/lib/queries'

export const metadata: Metadata = { title: 'Banner khuyến mãi' }

export default async function DiscountPage() {
  await connection()
  const discount = await getDiscount()

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Banner khuyến mãi</h1>
      {/* key forces a remount after router.refresh() delivers new server data,
          so useState re-initializes from the freshly saved values. */}
      <DiscountForm
        key={`${discount?.content}|${discount?.bgColor}|${discount?.status}`}
        initialContent={discount?.content ?? ''}
        initialBgColor={discount?.bgColor ?? 'bg-blue-600 text-white'}
        initialStatus={discount?.status ?? false}
      />
    </div>
  )
}
