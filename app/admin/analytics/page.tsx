import { connection } from 'next/server'

import type { Metadata } from 'next'

import { typeNames } from '@/lib/product-config'
import { getAnalytics } from '@/lib/queries'

export const metadata: Metadata = { title: 'Thống kê' }

export default async function AdminAnalyticsPage() {
  await connection()
  const { productsByType, openInquiries, recentSearches } = await getAnalytics()

  const totalProducts = productsByType.reduce((sum, r) => sum + r._count._all, 0)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Thống kê</h1>

      {/* Product counts */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Sản phẩm theo danh mục</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productsByType.map(row => (
            <div key={row.type} className="rounded-xl border bg-card p-4 space-y-1">
              <p className="text-xs text-muted-foreground">
                {typeNames[row.type as keyof typeof typeNames] ?? row.type}
              </p>
              <p className="text-3xl font-bold tabular-nums">{row._count._all}</p>
            </div>
          ))}
          <div className="rounded-xl border bg-muted/40 p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Tổng cộng</p>
            <p className="text-3xl font-bold tabular-nums">{totalProducts}</p>
          </div>
        </div>
      </section>

      {/* Open inquiries */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Yêu cầu báo giá</h2>
        <div className="rounded-xl border bg-card p-4 inline-flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Đang mở</p>
            <p className="text-3xl font-bold tabular-nums text-brand">{openInquiries}</p>
          </div>
          <a
            href="/admin/inquiries"
            className="text-sm text-brand hover:underline"
          >
            Xem tất cả →
          </a>
        </div>
      </section>

      {/* Top search queries */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Từ khoá tìm kiếm phổ biến</h2>
        {recentSearches.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu tìm kiếm.</p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Từ khoá</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Lượt tìm</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentSearches.map((row, i) => (
                  <tr key={row.query}>
                    <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="px-4 py-2.5 font-medium">{row.query}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row._count._all}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
