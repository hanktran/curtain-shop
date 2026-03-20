'use client'
import { useState } from 'react'

import { X } from 'lucide-react'
import sanitizeHtml from 'sanitize-html'

import type { Discount } from '@/types'

export function DiscountBanner({ discount }: { discount: Discount | null }) {
  const [visible, setVisible] = useState(true)

  if (!discount?.status || !visible) return null

  // Sanitize on the client — safe to use dangerouslySetInnerHTML
  const safeHtml = sanitizeHtml(discount.content, {
    allowedTags: ['b', 'i', 'u', 'strong', 'em', 'span', 'p', 'br'],
    allowedAttributes: { span: ['style'], p: ['style'] },
  })

  function handleDismiss() {
    setVisible(false)
  }

  return (
    <div
      // aria-live so screen readers announce when the banner appears
      aria-live="polite"
      className={`relative flex items-center justify-center py-2 px-10 text-sm ${discount.bgColor}`}
    >
      <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Đóng thông báo"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
