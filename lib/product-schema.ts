import { z } from 'zod'

import { categories, categoriesByType } from './product-config'

export const productSchema = z.object({
  title:          z.string().min(3, { error: 'Tên sản phẩm phải ít nhất 3 ký tự' }),
  slug:           z.string()
    .min(2, { error: 'Slug phải ít nhất 2 ký tự' })
    .max(200, { error: 'Slug tối đa 200 ký tự' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang' })
    .optional(),
  type:           z.enum(['curtains-blinds', 'flooring', 'wallpaper', '3d-art']),
  category:       z.enum(categories, { error: 'Danh mục không hợp lệ' }),
  price:          z.string().min(1, { error: 'Vui lòng nhập giá' }),
  origin:         z.string().min(1, { error: 'Vui lòng chọn xuất xứ' }),
  color:          z.array(z.string()).default([]),
  material:       z.array(z.string()).default([]),
  showOnHomePage: z.boolean().default(false),
  images:         z.array(z.url()).min(1, { error: 'Vui lòng chọn hình cho sản phẩm' }),
  wood:           z.string().optional(),
  brand:          z.string().optional(),
  windowBlinds:   z.string().optional(),
}).superRefine((data, ctx) => {
  const validCats = categoriesByType[data.type] ?? []
  if (!validCats.includes(data.category)) {
    ctx.addIssue({
      code: 'custom',
      path: ['category'],
      message: 'Danh mục không hợp lệ cho loại sản phẩm này',
    })
  }
})
