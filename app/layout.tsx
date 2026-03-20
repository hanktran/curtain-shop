import './globals.css'

import { Be_Vietnam_Pro } from 'next/font/google'

import type { Metadata } from 'next'

import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'

const font = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nội thất Đại Dương',
    template: '%s | Nội thất Đại Dương',
  },
  description: 'Chuyên cung cấp rèm cửa, màn sáo, sàn gỗ, giấy dán tường và tranh 3D chất lượng cao tại Việt Nam.',
  keywords: ['rèm cửa', 'màn sáo', 'sàn gỗ', 'giấy dán tường', 'tranh 3D', 'nội thất', 'Đại Dương', 'Việt Nam'],
  authors: [{ name: 'Nội thất Đại Dương', url: siteUrl }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Nội thất Đại Dương',
    title: 'Nội thất Đại Dương',
    description: 'Chuyên cung cấp rèm cửa, màn sáo, sàn gỗ, giấy dán tường và tranh 3D chất lượng cao.',
    url: siteUrl,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nội thất Đại Dương',
    description: 'Chuyên cung cấp rèm cửa, màn sáo, sàn gỗ, giấy dán tường và tranh 3D chất lượng cao.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Nội thất Đại Dương',
  description: 'Chuyên cung cấp rèm cửa, màn sáo, sàn gỗ, giấy dán tường và tranh 3D chất lượng cao.',
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'VN',
  },
  priceRange: '$$',
}

// Root layout: bare HTML shell + global providers shared by ALL routes (public + admin).
// Per-group chrome (Header, Footer, DiscountBanner) lives in app/(public)/layout.tsx.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={font.className} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-brand text-primary-foreground px-4 py-2 rounded-md font-medium"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
