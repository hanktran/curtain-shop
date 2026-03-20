'use server'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const discountSchema = z.object({
  content: z.string().min(1),
  bgColor: z.enum([
    'bg-blue-600 text-white',
    'bg-gray-500 text-white',
    'bg-green-600 text-white',
    'bg-red-500 text-white',
    'bg-yellow-400 text-black',
    'bg-sky-400 text-black',
    'bg-gray-900 text-white',
  ]),
  status: z.boolean(),
})

export async function updateDiscount(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const parsed = discountSchema.safeParse({
    content: formData.get('content'),
    bgColor: formData.get('bgColor'),
    status:  formData.get('status') === 'on',
  })
  if (!parsed.success) return { errors: parsed.error.flatten((i) => i.message).fieldErrors }

  // Sanitize HTML on the server before storage — prevents stored XSS.
  // sanitize-html is Node.js-compatible (replaces browser-only DOMPurify).
  const safeContent = sanitizeHtml(parsed.data.content, {
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
  })

  // Atomic transaction — if create fails, deleteMany is rolled back
  await prisma.$transaction(async (tx) => {
    await tx.discount.deleteMany()
    await tx.discount.create({
      data: { content: safeContent, bgColor: parsed.data.bgColor, status: parsed.data.status },
    })
  })

  updateTag('discount')
  return { success: true as const }
}
