import type { Metadata } from 'next'

import { ProjectsMasonry } from '@/components/ProjectsMasonry'
import { getPublishedProjects } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Công trình thực tế | Nội thất Đại Dương',
  description: 'Khám phá các công trình thực tế đã thi công bởi Nội thất Đại Dương.',
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Công trình thực tế</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Những dự án đã hoàn thiện bởi Nội thất Đại Dương, từ căn hộ, biệt thự đến không gian thương mại.
        </p>
      </div>

      <ProjectsMasonry
        projects={projects.map((project) => ({
          id: project.id,
          slug: project.slug,
          title: project.title,
          roomType: project.roomType,
          avatar: project.avatar,
        }))}
      />
    </div>
  )
}
