import type { Metadata } from 'next'

import { ProjectForm } from '@/components/admin/ProjectForm'

export const metadata: Metadata = { title: 'Thêm công trình mới' }

export default function AddProjectPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold">Thêm công trình mới</h1>
      <ProjectForm />
    </div>
  )
}