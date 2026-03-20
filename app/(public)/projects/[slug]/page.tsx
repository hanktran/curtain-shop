import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Metadata } from 'next'
import sanitizeHtml from 'sanitize-html'

import { ProductGallery } from '@/components/ProductGallery'
import { Badge } from '@/components/ui/badge'
import { roomTypes } from '@/lib/project-config'
import { getProjectBySlug } from '@/lib/queries'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://noithatdaiduong.net.vn'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}

  return {
    title: `${project.title} | Công trình thực tế`,
    description: `Công trình ${project.title} do Nội thất Đại Dương thực hiện.`,
    openGraph: {
      type: 'website',
      title: project.title,
      description: `Công trình ${project.title} do Nội thất Đại Dương thực hiện.`,
      url: `${siteUrl}/projects/${project.slug}`,
      images: [{ url: project.avatar, width: 1200, height: 630 }],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: `Công trình ${project.title} do Nội thất Đại Dương thực hiện.`,
      images: [project.avatar],
    },
  }
}

export default async function ProjectDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const safeHtml = sanitizeHtml(project.description, {
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

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/projects" className="mb-6 inline-block text-sm text-muted-foreground hover:text-brand">
        ← Tất cả công trình
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={project.images} title={project.title} />

        <div className="space-y-4">
          <Badge variant="secondary">{roomTypes[project.roomType] ?? project.roomType}</Badge>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">{project.title}</h1>
          <div
            className="prose prose-sm max-w-none text-foreground prose-p:leading-7"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>
      </div>
    </div>
  )
}