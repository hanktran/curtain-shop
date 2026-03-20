import { z } from 'zod'

import { roomTypeList } from './project-config'

export const projectSchema = z.object({
  title: z.string().min(1, { error: 'Vui lòng nhập tên công trình' }),
  slug: z.string()
    .min(1, { error: 'Vui lòng nhập slug' })
    .regex(/^[a-z0-9-]+$/, { error: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang' }),
  description: z.string().min(1, { error: 'Vui lòng nhập mô tả' }),
  roomType: z.enum(roomTypeList, { error: 'Vui lòng chọn loại phòng' }),
  images: z.array(z.url()).min(1, { error: 'Vui lòng tải lên ít nhất 1 ảnh' }),
  published: z.boolean(),
})