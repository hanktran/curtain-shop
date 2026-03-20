import { connection } from 'next/server'

import type { Metadata } from 'next'

import { AdminInquiriesTable } from '@/components/admin/AdminInquiriesTable'
import { getAdminInquiries } from '@/lib/queries'

export const metadata: Metadata = { title: 'Yêu cầu báo giá' }

export default async function AdminInquiriesPage() {
  await connection()
  const inquiries = await getAdminInquiries()
  const open      = inquiries.filter(i => i.status === 'OPEN').length

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Yêu cầu báo giá</h1>
        {open > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-brand text-white px-2 py-0.5 text-xs font-semibold tabular-nums">
            {open} mới
          </span>
        )}
      </div>
      <AdminInquiriesTable inquiries={inquiries} />
    </div>
  )
}
