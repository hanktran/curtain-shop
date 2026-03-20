'use client'
import { useMemo, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { deleteProject, togglePublished } from '@/actions/project'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { roomTypes } from '@/lib/project-config'

type AdminProject = {
  id: string
  slug: string
  title: string
  roomType: string
  avatar: string
  published: boolean
  createdAt: Date
}

interface Props {
  projects: AdminProject[]
}

function PublishedToggle({ projectId, initial }: Readonly<{ projectId: string; initial: boolean }>) {
  const [checked, setChecked] = useState(initial)
  const [pending, startTransition] = useTransition()

  function handleChange(value: boolean) {
    setChecked(value)
    startTransition(async () => {
      await togglePublished(projectId, value)
      toast.success(value ? 'Đã xuất bản công trình' : 'Đã ẩn công trình')
    })
  }

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(v) => handleChange(Boolean(v))}
      disabled={pending}
      aria-label="Trạng thái hiển thị"
    />
  )
}

function DeleteProjectButton({ projectId, projectTitle }: Readonly<{ projectId: string; projectTitle: string }>) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(projectId)
      if (result && 'success' in result) {
        toast.success('Đã xóa công trình')
        router.refresh()
      } else {
        toast.error((result && 'error' in result) ? result.error : 'Xóa thất bại')
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          {isPending ? 'Đang xóa…' : 'Xóa'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa công trình?</AlertDialogTitle>
          <AlertDialogDescription>
            Thao tác này sẽ xóa vĩnh viễn <strong>{projectTitle}</strong> và không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function AdminProjectsTable({ projects }: Readonly<Props>) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => projects.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [projects, search],
  )

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Tìm tên công trình…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-72"
        />
        {search && (
          <span className="self-center text-sm text-muted-foreground">
            {filtered.length} / {projects.length} công trình
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại phòng</TableHead>
              <TableHead className="w-24">Hiển thị</TableHead>
              <TableHead className="w-36">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded">
                    <Image
                      src={project.avatar}
                      alt={project.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs font-medium">
                  <p className="truncate">{project.title}</p>
                  <p className="text-xs text-muted-foreground">/{project.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {roomTypes[project.roomType] ?? project.roomType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <PublishedToggle projectId={project.id} initial={project.published} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/edit-project/${project.id}`}>
                      <Button variant="outline" size="sm">Sửa</Button>
                    </Link>
                    <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-muted-foreground">
                  {projects.length === 0 ? (
                    <>
                      Chưa có công trình nào.{' '}
                      <Link href="/admin/add-project" className="text-brand hover:underline">
                        Thêm công trình đầu tiên
                      </Link>
                    </>
                  ) : (
                    'Không tìm thấy công trình phù hợp.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}