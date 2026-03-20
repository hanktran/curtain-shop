'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ProjectModel as Project } from '@/lib/generated/prisma/models/Project'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createProject, updateProject } from '@/actions/project'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { roomTypes } from '@/lib/project-config'
import { projectSchema } from '@/lib/project-schema'
import { generateSlug } from '@/lib/utils'

type ProjectFormValues = z.infer<typeof projectSchema>

interface Props {
  project?: Project
}

type FieldErrors = Record<string, string[] | undefined>

export function ProjectForm({ project }: Readonly<Props>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(project?.images ?? [])
  const [isImagesDirty, setIsImagesDirty] = useState(false)
  const [description, setDescription] = useState(project?.description ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: project?.title ?? '',
      slug: project?.slug ?? '',
      roomType: project?.roomType ?? 'apartment',
      description: project?.description ?? '',
      images: project?.images ?? [],
      published: project?.published ?? false,
    },
  })
  const roomTypeValue = useWatch({ control: form.control, name: 'roomType' })
  const publishedValue = useWatch({ control: form.control, name: 'published' })

  useUnsavedChanges(form.formState.isDirty || isImagesDirty)

  let submitLabel = ''
  if (isPending) {
    submitLabel = project ? 'Đang cập nhật…' : 'Đang thêm…'
  } else {
    submitLabel = project ? 'Cập nhật công trình' : 'Thêm công trình'
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!project) {
      form.setValue('slug', generateSlug(e.target.value), { shouldValidate: true })
    }
  }

  function fieldError(name: keyof ProjectFormValues | string) {
    const msgs = errors[name as string]
    if (!msgs?.length) return null
    return <p className="mt-1 text-xs text-destructive">{msgs[0]}</p>
  }

  function onSubmit(values: ProjectFormValues) {
    setErrors({})

    const formData = new FormData()
    formData.set('title', values.title)
    formData.set('slug', values.slug)
    formData.set('roomType', values.roomType)
    formData.set('description', description || values.description)
    ;(uploadedUrls.length ? uploadedUrls : values.images).forEach((url) => formData.append('images', url))
    if (values.published) formData.set('published', 'on')

    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData)

      if (result && 'errors' in result) {
        setErrors(result.errors as FieldErrors)
        toast.error('Vui lòng kiểm tra lại thông tin')
        return
      }

      setIsImagesDirty(false)
      form.reset({
        ...values,
        description: description || values.description,
        images: uploadedUrls.length ? uploadedUrls : values.images,
      })
      toast.success(project ? 'Cập nhật công trình thành công' : 'Thêm công trình thành công')
      router.push('/admin/projects')
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate autoComplete="off">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="title">Tên công trình</Label>
            <Input
              id="title"
              {...form.register('title')}
              onChange={(e) => {
                form.register('title').onChange(e)
                handleTitleChange(e)
              }}
            />
            {fieldError('title')}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug (URL)</Label>
              <button
                type="button"
                className="text-xs text-brand hover:underline"
                onClick={() => {
                  const title = form.getValues('title')
                  form.setValue('slug', generateSlug(title), { shouldValidate: true })
                }}
              >
                Tự tạo từ tên
              </button>
            </div>
            <Input id="slug" {...form.register('slug')} />
            {fieldError('slug')}
          </div>

          <div className="space-y-1">
            <Label htmlFor="roomType">Loại phòng</Label>
            <Select
              value={roomTypeValue}
              onValueChange={(value) => {
                form.setValue('roomType', value as ProjectFormValues['roomType'], { shouldValidate: true })
              }}
            >
              <SelectTrigger id="roomType">
                <SelectValue placeholder="Chọn loại phòng" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roomTypes).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError('roomType')}
          </div>

          <div className="space-y-1">
            <Label>Mô tả</Label>
            <TiptapEditor
              name="description"
              initialContent={description}
              onChange={(html) => {
                setDescription(html)
                form.setValue('description', html, { shouldValidate: true })
              }}
            />
            {fieldError('description')}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="published"
              checked={publishedValue}
              onCheckedChange={(v) => form.setValue('published', Boolean(v), { shouldValidate: true })}
            />
            <Label htmlFor="published">Hiển thị công khai</Label>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="space-y-1">
            <Label>Hình ảnh</Label>
            <ImageUploader
              onUploadComplete={(urls) => {
                if (urls.length > 0) setIsImagesDirty(true)
                setUploadedUrls((prev) => {
                  const next = [...prev, ...urls]
                  form.setValue('images', next, { shouldValidate: true })
                  return next
                })
              }}
              onRemoveImage={(url) => {
                setIsImagesDirty(true)
                setUploadedUrls((prev) => {
                  const next = prev.filter((u) => u !== url)
                  form.setValue('images', next, { shouldValidate: true })
                  return next
                })
              }}
              existingImages={uploadedUrls}
            />
            {fieldError('images')}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/projects')}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>{submitLabel}</Button>
          </div>
        </div>
      </div>
    </form>
  )
}