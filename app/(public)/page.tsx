import Link from 'next/link'

import { Phone } from 'lucide-react'

import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/site-config'
import { typeNames } from '@/lib/product-config'
import { type FeaturedProduct, getFeaturedProducts } from '@/lib/queries'

const stats = [
  { value: '10+',    label: 'Năm kinh nghiệm' },
  { value: '5.000+', label: 'Công trình hoàn thành' },
  { value: '1.000+', label: 'Mẫu sản phẩm' },
  { value: '100%',   label: 'Lắp đặt tận nơi' },
]

function CurtainIllustration() {
  return (
    <svg
      viewBox="0 0 440 500"
      className="w-full max-w-md select-none drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hi-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="hi-lc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#163d28" />
          <stop offset="80%" stopColor="#246040" />
        </linearGradient>
        <linearGradient id="hi-rc" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#163d28" />
          <stop offset="80%" stopColor="#246040" />
        </linearGradient>
        <radialGradient id="hi-floor" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Wall */}
      <rect width="440" height="500" fill="#0f172a" />
      <rect x="0" y="0" width="440" height="6" fill="#1e293b" />
      <rect x="0" y="440" width="440" height="60" fill="#0c1220" />
      <rect x="0" y="438" width="440" height="6" fill="#1e293b" />
      <rect x="0" y="472" width="440" height="5" fill="#1e293b" />

      {/* Window warm glow */}
      <rect x="113" y="74" width="214" height="308" fill="url(#hi-glow)" />

      {/* Window frame */}
      <rect x="108" y="68" width="224" height="320" rx="3" fill="none" stroke="#475569" strokeWidth="7" />
      {/* Mullions */}
      <line x1="220" y1="68" x2="220" y2="388" stroke="#475569" strokeWidth="4" />
      <line x1="108" y1="228" x2="332" y2="228" stroke="#475569" strokeWidth="4" />
      {/* Window sill */}
      <rect x="100" y="386" width="240" height="14" rx="2" fill="#1e293b" />
      <rect x="96" y="397" width="248" height="6" rx="1" fill="#334155" />

      {/* ── Left curtain ── */}
      <path
        d="M 20 52 C 40 52, 95 55, 118 56
           L 118 72
           C 110 148, 80 196, 52 266
           C 40 296, 35 358, 30 448
           L 20 448 Z"
        fill="url(#hi-lc)"
      />
      {/* Fold lines */}
      <path d="M 46 52 C 48 96, 65 152, 68 202" stroke="#1a5535" strokeWidth="1.5" fill="none" strokeOpacity="0.55" />
      <path d="M 68 53 C 70 92, 84 136, 87 180" stroke="#1a5535" strokeWidth="1.5" fill="none" strokeOpacity="0.55" />
      <path d="M 88 54 C 90 86, 98 122, 100 158" stroke="#1a5535" strokeWidth="1.5" fill="none" strokeOpacity="0.45" />
      {/* Highlight edge */}
      <path
        d="M 20 52 C 40 52, 95 55, 118 56 L 118 72 C 110 148, 80 196, 52 266 C 40 296, 35 358, 30 448"
        stroke="#4db87a" strokeWidth="1.2" fill="none" strokeOpacity="0.35"
      />

      {/* ── Right curtain ── */}
      <path
        d="M 420 52 C 400 52, 345 55, 322 56
           L 322 72
           C 330 148, 360 196, 388 266
           C 400 296, 405 358, 410 448
           L 420 448 Z"
        fill="url(#hi-rc)"
      />
      {/* Fold lines */}
      <path d="M 394 52 C 392 96, 375 152, 372 202" stroke="#1a5535" strokeWidth="1.5" fill="none" strokeOpacity="0.55" />
      <path d="M 372 53 C 370 92, 356 136, 353 180" stroke="#1a5535" strokeWidth="1.5" fill="none" strokeOpacity="0.55" />
      <path d="M 352 54 C 350 86, 342 122, 340 158" stroke="#1a5535" strokeWidth="1.5" fill="none" strokeOpacity="0.45" />
      {/* Highlight edge */}
      <path
        d="M 420 52 C 400 52, 345 55, 322 56 L 322 72 C 330 148, 360 196, 388 266 C 400 296, 405 358, 410 448"
        stroke="#4db87a" strokeWidth="1.2" fill="none" strokeOpacity="0.35"
      />

      {/* ── Tie-backs ── */}
      <path d="M 52 266 Q 82 258, 118 262" stroke="#e2e8f0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="47" cy="270" r="7" fill="#cbd5e1" />
      <circle cx="47" cy="270" r="3.5" fill="#475569" />

      <path d="M 388 266 Q 358 258, 322 262" stroke="#e2e8f0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="393" cy="270" r="7" fill="#cbd5e1" />
      <circle cx="393" cy="270" r="3.5" fill="#475569" />

      {/* ── Curtain rod ── */}
      <line x1="15" y1="48" x2="425" y2="48" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="15" cy="48" rx="12" ry="9" fill="#cbd5e1" />
      <ellipse cx="425" cy="48" rx="12" ry="9" fill="#cbd5e1" />
      {/* Brackets */}
      <rect x="169" y="44" width="6" height="14" rx="2" fill="#64748b" />
      <rect x="265" y="44" width="6" height="14" rx="2" fill="#64748b" />

      {/* ── Valance ── */}
      <path
        d="M 15 36
           L 425 36 L 425 48
           Q 385 66, 345 50
           Q 315 37, 285 55
           Q 265 67, 245 55
           Q 225 44, 220 48
           Q 215 44, 195 55
           Q 175 67, 155 55
           Q 125 37, 95 50
           Q 55 66, 15 48 Z"
        fill="#163d28"
      />
      {/* Valance bottom highlight */}
      <path
        d="M 15 48
           Q 55 66, 95 50
           Q 125 37, 155 55
           Q 175 67, 195 55
           Q 215 44, 220 48
           Q 225 44, 245 55
           Q 265 67, 285 55
           Q 315 37, 345 50
           Q 385 66, 425 48"
        stroke="#4db87a" strokeWidth="1" fill="none" strokeOpacity="0.5"
      />

      {/* Floor light pool */}
      <ellipse cx="220" cy="456" rx="95" ry="22" fill="url(#hi-floor)" />
    </svg>
  )
}

export default async function HomePage() {
  const products = await getFeaturedProducts()

  const sections = [
    { type: 'curtains-blinds', items: products.filter((p: FeaturedProduct) => p.type === 'curtains-blinds') },
    { type: 'flooring',        items: products.filter((p: FeaturedProduct) => p.type === 'flooring') },
    { type: 'wallpaper',       items: products.filter((p: FeaturedProduct) => p.type === 'wallpaper') },
    { type: '3d-art',          items: products.filter((p: FeaturedProduct) => p.type === '3d-art') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/2 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-brand/8 blur-2xl" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 py-[var(--section-gap)] md:py-[var(--section-gap-lg)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* ── Left: text ── */}
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-sm font-medium tracking-widest uppercase text-brand">
                Giải pháp nội thất cao cấp
              </p>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                Không gian sống{' '}
                <span className="text-brand">tinh tế</span>
              </h1>
              <p className="text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Rèm cửa, sàn gỗ, giấy dán tường và tranh 3D — nâng tầm thẩm mỹ cho mọi không gian.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                {Object.entries(typeNames).map(([slug, name]) => (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-brand hover:text-white border border-white/20 text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                  >
                    {name}
                  </Link>
                ))}
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                <Link
                  href="/curtains-blinds"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                >
                  Khám phá sản phẩm
                </Link>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white text-sm font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            {/* ── Right: illustration ── */}
            <div className="hidden lg:flex justify-center items-center">
              <CurtainIllustration />
            </div>

          </div>
        </div>

        {/* Scroll affordance */}
        <div className="flex justify-center pb-8 animate-bounce text-white/30" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </section>

      {/* Trust signal stats */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-brand-warm">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured product sections */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-[var(--section-gap)] space-y-[var(--section-gap)]">
        {sections.map(({ type, items }) =>
          items.length > 0 ? (
            <section key={type}>
              <div className="flex items-center justify-between mb-6 sticky top-16 z-10 bg-background/95 backdrop-blur-sm py-2 md:static md:bg-transparent md:backdrop-blur-none">
                <h2 className="text-xl md:text-2xl font-bold">
                  {typeNames[type as keyof typeof typeNames]}
                </h2>
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={`/${type}`}>
                    Xem tất cả
                    <span className="inline-flex items-center justify-center rounded-full bg-brand/10 px-1.5 py-0.5 text-xs font-medium tabular-nums">
                      {items.length}
                    </span>
                  </Link>
                </Button>
              </div>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {items.map((product: FeaturedProduct) => (
                  <div key={product.id} className="min-w-[44%] snap-start shrink-0 sm:min-w-[30%] md:min-w-0 md:shrink">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          ) : null
        )}

        {sections.every(({ items }) => items.length === 0) && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Chưa có sản phẩm nổi bật.</p>
            <p className="text-sm mt-2">Vui lòng quay lại sau.</p>
          </div>
        )}
      </div>
    </>
  )
}
