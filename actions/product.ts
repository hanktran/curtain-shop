'use server'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { UTApi } from 'uploadthing/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/product-schema'
import { getProductsByTypePaginated } from '@/lib/queries'

const utapi = new UTApi()

function isPrismaUniqueViolation(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { code?: string }).code === 'P2002'
}

function parseMultiValue(formData: FormData, key: string): string[] {
  const all = formData.getAll(key)
  if (!all.length) return []

  return all
    .flatMap((v) => (typeof v === 'string' ? v.split(',') : []))
    .map((v) => v.trim())
    .filter(Boolean)
}

// Explicit allowlist — prevents mass assignment of internal fields like id, userId
function toProductData(data: z.infer<typeof productSchema>, userId: string) {
  return {
    slug:           data.slug,
    title:          data.title,
    type:           data.type,
    category:       data.category,
    price:          data.price,
    origin:         data.origin,
    color:          data.color,
    material:       data.material,
    showOnHomePage: data.showOnHomePage,
    images:         data.images,
    avatar:         data.images[0],
    wood:           data.wood ?? null,
    brand:          data.brand ?? null,
    windowBlinds:   data.windowBlinds ?? null,
    userId,
  }
}

function extractUploadKey(url: string): string | null {
  const part = url.split('/f/')[1]
  return part || null
}

export async function createProduct(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const raw = Object.fromEntries(formData)
  const parsed = productSchema.safeParse({
    ...raw,
    color:          parseMultiValue(formData, 'color'),
    material:       parseMultiValue(formData, 'material'),
    images:         formData.getAll('images'),
    showOnHomePage: raw.showOnHomePage === 'on',
  })
  if (!parsed.success) return { errors: parsed.error.flatten((i) => i.message).fieldErrors }

  try {
    await prisma.product.create({ data: toProductData(parsed.data, session.user.id) })
  } catch (e: unknown) {
    if (isPrismaUniqueViolation(e)) {
      return { errors: { slug: ['Slug này đã tồn tại, vui lòng chọn slug khác'] } }
    }
    console.error('[createProduct]', e)
    return { errors: { _form: ['Đã xảy ra lỗi, vui lòng thử lại'] } }
  }
  updateTag('products')
  return { success: true as const }
}

export async function updateProduct(productId: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing || existing.userId !== session.user.id) redirect('/admin/products')

  const raw = Object.fromEntries(formData)
  const newImages = formData.getAll('images') as string[]
  const parsed = productSchema.safeParse({
    ...raw,
    color:          parseMultiValue(formData, 'color'),
    material:       parseMultiValue(formData, 'material'),
    images:         newImages.length ? newImages : existing.images,
    showOnHomePage: raw.showOnHomePage === 'on',
  })
  if (!parsed.success) return { errors: parsed.error.flatten((i) => i.message).fieldErrors }

  // Update DB first — prevents data loss if file deletion fails afterward
  try {
    await prisma.product.update({
      where: { id: productId },
      data: toProductData(parsed.data, session.user.id),
    })
  } catch (e: unknown) {
    if (isPrismaUniqueViolation(e)) {
      return { errors: { slug: ['Slug này đã tồn tại, vui lòng chọn slug khác'] } }
    }
    console.error('[updateProduct]', e)
    return { errors: { _form: ['Đã xảy ra lỗi, vui lòng thử lại'] } }
  }
  updateTag('products')

  // Delete old assets after successful DB update (best-effort, non-blocking)
  if (newImages.length) {
    const oldKeys = existing.images.map(extractUploadKey).filter(Boolean) as string[]
    if (oldKeys.length) utapi.deleteFiles(oldKeys).catch((e) => console.error('[updateProduct] file cleanup failed', e))
  }

  return { success: true as const }
}

export async function toggleHomePage(productId: string, value: boolean) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  await prisma.product.update({
    where: { id: productId },
    data:  { showOnHomePage: value },
  })
  updateTag('products')
}

export async function deleteProduct(productId: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.userId !== session.user.id) return { error: 'Không tìm thấy sản phẩm' }

  // Delete DB record first, then clean up assets best-effort
  await prisma.product.delete({ where: { id: productId } })
  updateTag('products')

  const keys = product.images.map(extractUploadKey).filter(Boolean) as string[]
  if (keys.length) utapi.deleteFiles(keys).catch((e) => console.error('[deleteProduct] file cleanup failed', e))

  return { success: true as const }
}

export async function loadMoreProducts(type: string, category: string | undefined, cursor: string) {
  return getProductsByTypePaginated(type, category, cursor)
}
