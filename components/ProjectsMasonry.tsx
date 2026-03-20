'use client'
import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { roomTypes } from '@/lib/project-config'

type ProjectItem = {
  id: string
  slug: string
  title: string
  roomType: string
  avatar: string
}

interface Props {
  projects: ProjectItem[]
}

export function ProjectsMasonry({ projects }: Props) {
  const [selectedRoom, setSelectedRoom] = useState<string>('all')

  const filtered = useMemo(() => {
    if (selectedRoom === 'all') return projects
    return projects.filter((project) => project.roomType === selectedRoom)
  }, [projects, selectedRoom])

  const roomPills = Object.entries(roomTypes)

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedRoom('all')}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            selectedRoom === 'all'
              ? 'bg-brand text-white'
              : 'border bg-muted hover:border-brand hover:text-brand'
          }`}
        >
          Tất cả
        </button>
        {roomPills.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelectedRoom(value)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              selectedRoom === value
                ? 'bg-brand text-white'
                : 'border bg-muted hover:border-brand hover:text-brand'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-20 text-center">
          <p className="text-xl font-semibold">Chưa có công trình nào</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Chúng tôi đang cập nhật thêm các công trình thực tế mới. Vui lòng quay lại sau.
          </p>
        </div>
      ) : (
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block break-inside-avoid overflow-hidden rounded-xl border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.avatar}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-4">
                <Badge variant="secondary" className="text-xs">
                  {roomTypes[project.roomType] ?? project.roomType}
                </Badge>
                <h2 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-brand">
                  {project.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}