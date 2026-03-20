'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Building2 } from 'lucide-react'

export function AdminNav() {
  const pathname = usePathname()
  const navLinks = [
    { href: '/admin/products',    label: 'Sản phẩm' },
    { href: '/admin/add-product', label: 'Thêm sản phẩm' },
    { href: '/admin/discount',    label: 'Banner khuyến mãi' },
    { href: '/admin/inquiries',   label: 'Yêu cầu' },
    { href: '/admin/analytics',   label: 'Thống kê' },
  ]
  return (
    <div className="flex items-center gap-4">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm transition-colors hover:text-brand ${
            pathname.startsWith(link.href) ? 'text-brand font-semibold' : ''
          }`}
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/admin/projects"
        className={`inline-flex items-center gap-1.5 text-sm transition-colors hover:text-brand ${
          pathname.startsWith('/admin/projects') ? 'text-brand font-semibold' : ''
        }`}
      >
        <Building2 className="h-3.5 w-3.5" />
        Công trình
      </Link>
    </div>
  )
}
