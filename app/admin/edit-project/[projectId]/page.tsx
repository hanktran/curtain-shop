import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import type { Metadata } from 'next'

import { ProjectForm } from '@/components/admin/ProjectForm'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Chỉnh sửa công trình' }

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function EditProjectPage({ params }: Props) {
  await connection()
  const { projectId } = await params

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa: {project.title}</h1>
      <ProjectForm key={project.id} project={project} />
    </div>
  )
}