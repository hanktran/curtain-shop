'use client'
import { useTransition } from 'react'

import { closeInquiry, reopenInquiry } from '@/actions/inquiry'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Inquiry = {
  id: string
  name: string
  phone: string
  message: string | null
  productTitle: string | null
  status: 'OPEN' | 'CLOSED'
  createdAt: Date
}

interface Props {
  inquiries: Inquiry[]
}

function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const [pending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      if (inquiry.status === 'OPEN') {
        await closeInquiry(inquiry.id)
      } else {
        await reopenInquiry(inquiry.id)
      }
    })
  }

  return (
    <TableRow key={inquiry.id} className={inquiry.status === 'CLOSED' ? 'opacity-50' : ''}>
      <TableCell className="font-medium">{inquiry.name}</TableCell>
      <TableCell>
        <a href={`tel:${inquiry.phone}`} className="hover:text-brand transition-colors">
          {inquiry.phone}
        </a>
      </TableCell>
      <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
        {inquiry.productTitle ?? '—'}
      </TableCell>
      <TableCell className="max-w-[200px] text-sm text-muted-foreground">
        {inquiry.message ?? '—'}
      </TableCell>
      <TableCell>
        <Badge variant={inquiry.status === 'OPEN' ? 'default' : 'secondary'}>
          {inquiry.status === 'OPEN' ? 'Mở' : 'Đã xử lý'}
        </Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
        {new Date(inquiry.createdAt).toLocaleDateString('vi-VN')}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={toggle}
          className="text-xs"
        >
          {inquiry.status === 'OPEN' ? 'Đóng' : 'Mở lại'}
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function AdminInquiriesTable({ inquiries }: Props) {
  if (inquiries.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border rounded-xl">
        <p>Chưa có yêu cầu báo giá nào.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map(inq => (
            <InquiryRow key={inq.id} inquiry={inq} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
