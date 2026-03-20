'use client'
import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'

interface Props {
  title: string
  url: string
}

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false)

  const fbUrl    = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const zaloUrl  = `https://zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select input trick
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <Share2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
      <span className="text-xs text-muted-foreground">Chia sẻ:</span>

      {/* Facebook */}
      <a
        href={fbUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chia sẻ lên Facebook"
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs hover:border-[#1877F2] hover:text-[#1877F2] transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
        </svg>
        Facebook
      </a>

      {/* Zalo */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chia sẻ qua Zalo"
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs hover:border-[#0068FF] hover:text-[#0068FF] transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
          <path d="M12 0C5.373 0 0 4.944 0 11.04c0 3.385 1.693 6.405 4.348 8.414L3.234 23l4.512-1.475A12.29 12.29 0 0 0 12 22.08c6.627 0 12-4.944 12-11.04S18.627 0 12 0Z"/>
        </svg>
        Zalo
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        aria-label="Sao chép đường dẫn"
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs hover:border-brand hover:text-brand transition-colors"
      >
        {copied ? (
          <><Check className="h-3 w-3 text-green-600" aria-hidden="true" /><span className="text-green-600">Đã sao chép</span></>
        ) : (
          <><Copy className="h-3 w-3" aria-hidden="true" />Sao chép link</>
        )}
      </button>
    </div>
  )
}
