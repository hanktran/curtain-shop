import type { Discount as PrismaDiscount,Product as PrismaProduct } from '../lib/generated/prisma/client'

export type Product = PrismaProduct & {
  color: string[]
  material: string[]
}

export type FormattedProduct = Product & {
  typeName: string
  catName: string
  originNames: { origin: string; name: string }[]
}

export type Discount = PrismaDiscount
