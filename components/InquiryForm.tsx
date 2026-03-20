'use client'
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'

import { submitInquiry } from '@/actions/inquiry'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  productId?:    string
  productTitle?: string
}

export function InquiryForm({ productId, productTitle }: Props) {
  const [open,    setOpen]    = useState(false)
  const [pending, setPending] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const fd = new FormData(e.currentTarget)
    const result = await submitInquiry({
      name:         fd.get('name') as string,
      phone:        fd.get('phone') as string,
      message:      fd.get('message') as string || undefined,
      productId,
      productTitle,
    })

    setPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border bg-green-50 dark:bg-green-950/20 px-4 py-3 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
        Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất có thể.
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-brand hover:underline"
      >
        <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
        Để lại thông tin — chúng tôi gọi lại cho bạn
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-medium">Yêu cầu báo giá</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="inquiry-name" className="text-xs">Họ tên *</Label>
          <Input
            id="inquiry-name"
            name="name"
            required
            minLength={2}
            placeholder="Nguyễn Văn A"
            className="text-sm h-8"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="inquiry-phone" className="text-xs">Số điện thoại *</Label>
          <Input
            id="inquiry-phone"
            name="phone"
            type="tel"
            required
            placeholder="09xx xxx xxx"
            className="text-sm h-8"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="inquiry-message" className="text-xs">Ghi chú (tuỳ chọn)</Label>
        <Textarea
          id="inquiry-message"
          name="message"
          rows={2}
          maxLength={500}
          placeholder="Kích thước, màu sắc, số lượng…"
          className="text-sm resize-none"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={pending} className="flex-1">
          {pending ? 'Đang gửi…' : 'Gửi yêu cầu'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => { setOpen(false); setError(null) }}
        >
          Huỷ
        </Button>
      </div>
    </form>
  )
}
