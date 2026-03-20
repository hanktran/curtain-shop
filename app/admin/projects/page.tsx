import Link from 'next/link'
import { connection } from 'next/server'

import type { Metadata } from 'next'

import { AdminProjectsTable } from '@/components/admin/AdminProjectsTable'
import { Button } from '@/components/ui/button'
import { getAdminProjects } from '@/lib/queries'

export const metadata: Metadata = { title: 'Quản lý công trình' }

export default async function AdminProjectsPage() {
  await connection()
  const projects = await getAdminProjects()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <span>Quản lý công trình</span>
          <span className="inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {projects.length}
          </span>
        </h1>
        <Link href="/admin/add-project">
          <Button>Thêm công trình</Button>
        </Link>
      </div>

      <AdminProjectsTable projects={projects} />
    </div>
  )
}