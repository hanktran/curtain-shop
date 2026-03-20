'use server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const inquirySchema = z.object({
  name:         z.string().min(2, 'Vui lòng nhập tên (ít nhất 2 ký tự)'),
  phone:        z.string().min(9, 'Số điện thoại không hợp lệ').max(15),
  message:      z.string().max(500).optional(),
  productId:    z.string().optional(),
  productTitle: z.string().max(200).optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>

export async function submitInquiry(data: InquiryFormData) {
  const parsed = inquirySchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' }
  }

  await prisma.inquiry.create({ data: parsed.data })
  revalidateTag('inquiries', {})
  return { success: true }
}

export async function closeInquiry(id: string) {
  await prisma.inquiry.update({
    where: { id },
    data:  { status: 'CLOSED' },
  })
  revalidateTag('inquiries', {})
}

export async function reopenInquiry(id: string) {
  await prisma.inquiry.update({
    where: { id },
    data:  { status: 'OPEN' },
  })
  revalidateTag('inquiries', {})
}
