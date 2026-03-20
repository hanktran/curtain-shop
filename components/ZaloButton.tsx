'use client'
import { siteConfig } from '@/lib/site-config'

export function ZaloButton() {
  const phone = siteConfig.phone.replace(/\D/g, '')
  if (!phone) return null

  return (
    <a
      href={`https://zalo.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Liên hệ qua Zalo"
      // On mobile the sticky bottom CTA bar is 64px tall (py-3 + button),
      // so offset by 80px to sit above it. On md+ there is no sticky bar.
      className="fixed bottom-20 right-4 z-50 md:bottom-6 flex h-12 w-12 items-center justify-center rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200"
      style={{ backgroundColor: '#0068FF' }}
    >
      {/* Zalo chat bubble icon */}
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" aria-hidden="true">
        <path d="M16 3C9.373 3 4 7.925 4 14c0 3.388 1.71 6.41 4.4 8.48L7.5 26l4.18-1.39A13.07 13.07 0 0 0 16 25c6.627 0 12-4.925 12-11S22.627 3 16 3Z" fill="white"/>
        <path d="M10.5 17.5h5M13 12l-3 5.5h5.5" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.5 12v5.5M19.5 12l2.5 5.5M19.5 12l-2.5 5.5" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}
