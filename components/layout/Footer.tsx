import Link from 'next/link'

import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { siteConfig } from '@/lib/site-config'

const YEAR = new Date().getFullYear()
import { typeNames } from '@/lib/product-config'

export function Footer() {
  return (
    <footer className="border-t bg-muted mt-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="font-bold text-brand text-lg mb-3">{siteConfig.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chuyên cung cấp các sản phẩm trang trí nội thất chất lượng cao — rèm cửa, sàn gỗ, giấy dán tường và tranh 3D.
          </p>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Sản phẩm</h4>
          <ul className="space-y-2">
            {Object.entries(typeNames).map(([slug, name]) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="text-sm text-muted-foreground hover:text-brand transition-colors"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Thông tin</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-brand transition-colors">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-brand transition-colors">
                Công trình
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Liên hệ</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {siteConfig.phone && (
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-brand transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
            )}
            {siteConfig.email && (
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-brand transition-colors break-all"
                >
                  {siteConfig.email}
                </a>
              </li>
            )}
            {siteConfig.address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
                <a
                  href={siteConfig.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:underline"
                >
                  {siteConfig.address}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-brand" />
              <span>Thứ 2 – Thứ 7: 8:00 – 17:30</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground container mx-auto max-w-7xl px-4 sm:px-6">
        © {YEAR} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  )
}
