'use server'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import sanitizeHtml from 'sanitize-html'
import { UTApi } from 'uploadthing/server'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { projectSchema } from '@/lib/project-schema'

const utapi = new UTApi()

function isPrismaUniqueViolation(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { code?: string }).code === 'P2002'
}

function toProjectData(data: z.infer<typeof projectSchema>) {
  const safeDescription = sanitizeHtml(data.description, {
    allowedTags: ['b', 'i', 'u', 'strong', 'em', 'span', 'p', 'br'],
    allowedAttributes: { span: ['style'], p: ['style'] },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-f]{3,6}$/i, /^(red|orange|yellow|green|blue|purple)$/],
        'font-size': [/^\d+(px|em|rem)$/],
        'font-weight': [/^(bold|normal|\d+)$/],
        'text-decoration': [/^underline$/],
        'font-style': [/^italic$/],
      },
    },
  })

  return {
    slug: data.slug,
    title: data.title,
    description: safeDescription,
    roomType: data.roomType,
    images: data.images,
    avatar: data.images[0],
    published: data.published,
  }
}

function extractUploadKey(url: string): string | null {
  const part = url.split('/f/')[1]
  return part || null
}

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const raw = Object.fromEntries(formData)
  const parsed = projectSchema.safeParse({
    ...raw,
    images: formData.getAll('images'),
    published: raw.published === 'on',
  })
  if (!parsed.success) return { errors: parsed.error.flatten((i) => i.message).fieldErrors }

  try {
    await prisma.project.create({ data: toProjectData(parsed.data) })
  } catch (e: unknown) {
    if (isPrismaUniqueViolation(e)) {
      return { errors: { slug: ['Slug này đã tồn tại, vui lòng chọn slug khác'] } }
    }
    console.error('[createProject]', e)
    return { errors: { slug: ['Đã xảy ra lỗi, vui lòng thử lại'] } }
  }

  updateTag('projects')
  redirect('/admin/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) redirect('/admin/projects')

  const raw = Object.fromEntries(formData)
  const incomingImages = formData.getAll('images') as string[]
  const nextImages = incomingImages.length ? incomingImages : existing.images
  const parsed = projectSchema.safeParse({
    ...raw,
    images: nextImages,
    published: raw.published === 'on',
  })
  if (!parsed.success) return { errors: parsed.error.flatten((i) => i.message).fieldErrors }

  try {
    await prisma.project.update({
      where: { id },
      data: toProjectData(parsed.data),
    })
  } catch (e: unknown) {
    if (isPrismaUniqueViolation(e)) {
      return { errors: { slug: ['Slug này đã tồn tại, vui lòng chọn slug khác'] } }
    }
    console.error('[updateProject]', e)
    return { errors: { slug: ['Đã xảy ra lỗi, vui lòng thử lại'] } }
  }

  updateTag('projects')

  const removedImages = existing.images.filter((url) => !nextImages.includes(url))
  const removedKeys = removedImages.map(extractUploadKey).filter(Boolean) as string[]
  if (removedKeys.length) utapi.deleteFiles(removedKeys).catch((e) => console.error('[updateProject] file cleanup failed', e))

  redirect('/admin/projects')
}

export async function deleteProject(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) return { error: 'Không tìm thấy công trình' }

  await prisma.project.delete({ where: { id } })
  updateTag('projects')

  const keys = project.images.map(extractUploadKey).filter(Boolean) as string[]
  if (keys.length) utapi.deleteFiles(keys).catch((e) => console.error('[deleteProject] file cleanup failed', e))

  return { success: true as const }
}

export async function togglePublished(id: string, published: boolean) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  await prisma.project.update({
    where: { id },
    data: { published },
  })
  updateTag('projects')
}