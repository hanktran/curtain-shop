'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import sanitizeHtml from 'sanitize-html'
import { toast } from 'sonner'

import { updateDiscount } from '@/actions/discount'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const bgOptions = [
  { value: 'bg-blue-600 text-white',   label: 'Xanh dương' },
  { value: 'bg-gray-500 text-white',   label: 'Xám' },
  { value: 'bg-green-600 text-white',  label: 'Xanh lá' },
  { value: 'bg-red-500 text-white',    label: 'Đỏ' },
  { value: 'bg-yellow-400 text-black', label: 'Vàng' },
  { value: 'bg-sky-400 text-black',    label: 'Xanh nhạt' },
  { value: 'bg-gray-900 text-white',   label: 'Tối' },
]

interface Props {
  initialContent: string
  initialBgColor: string
  initialStatus: boolean
}

export function DiscountForm({ initialContent, initialBgColor, initialStatus }: Readonly<Props>) {
  const [status,    setStatus]    = useState(initialStatus)
  const [bgColor,   setBgColor]   = useState(initialBgColor)
  const [content,   setContent]   = useState(initialContent)
  const [isPending, startTransition] = useTransition()
  const router                       = useRouter()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateDiscount(formData)
      if (result && 'success' in result) {
        toast.success('Đã lưu banner khuyến mãi')
        router.refresh()
      } else if (result && 'errors' in result) {
        toast.error('Lưu thất bại. Vui lòng kiểm tra lại thông tin.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <Label>Nội dung</Label>
        <TiptapEditor name="content" initialContent={initialContent} onChange={setContent} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="bgColor">Màu nền</Label>
        <Select name="bgColor" defaultValue={initialBgColor} onValueChange={setBgColor}>
          <SelectTrigger id="bgColor">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {bgOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Live preview */}
      {status && (
        <div className="space-y-1">
          <Label>Xem trước</Label>
          <div
            className={`rounded-md py-2 px-10 text-sm text-center border ${bgColor}`}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content, {
              allowedTags: ['b', 'i', 'u', 'strong', 'em', 'span', 'p', 'br'],
              allowedAttributes: { span: ['style'], p: ['style'] },
              allowedStyles: {
                '*': {
                  color:             [/^#[0-9a-f]{3,6}$/i, /^(red|orange|yellow|green|blue|purple)$/],
                  'font-size':       [/^\d+(px|em|rem)$/],
                  'font-weight':     [/^(bold|normal|\d+)$/],
                  'text-decoration': [/^underline$/],
                  'font-style':      [/^italic$/],
                },
              },
            })}}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <Checkbox
          id="status"
          name="status"
          checked={status}
          onCheckedChange={(v) => setStatus(Boolean(v))}
        />
        <Label htmlFor="status">Hiển thị banner</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
      </Button>
    </form>
  )
}
