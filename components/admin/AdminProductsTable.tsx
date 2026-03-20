'use client'
import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { toggleHomePage } from '@/actions/product'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { catNames, formatPrice, typeNames } from '@/lib/product-config'

function HomePageToggle({ productId, initial }: { productId: string; initial: boolean }) {
  const [checked, setChecked] = useState(initial)
  const [pending, startTransition] = useTransition()
  function handleChange(value: boolean) {
    setChecked(value)
    startTransition(async () => { await toggleHomePage(productId, value) })
  }
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(v) => handleChange(Boolean(v))}
      disabled={pending}
      aria-label="Hiển thị trên trang chủ"
    />
  )
}

type Product = {
  id: string
  title: string
  type: string
  category: string
  price: string
  avatar: string
  showOnHomePage: boolean
}

interface Props {
  products: Product[]
}

export function AdminProductsTable({ products }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = products.filter((p) => {
    const matchesType  = typeFilter === 'all' || p.type === typeFilter
    const matchesTitle = p.title.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesTitle
  })

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Tìm tên sản phẩm…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {Object.entries(typeNames).map(([slug, name]) => (
              <SelectItem key={slug} value={slug}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || typeFilter !== 'all') && (
          <span className="text-sm text-muted-foreground self-center">
            {filtered.length} / {products.length} sản phẩm
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead className="w-24">Trang chủ</TableHead>
              <TableHead className="w-36">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    <Image src={p.avatar} alt={p.title} fill className="object-cover" sizes="48px" />
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate">{p.title}</TableCell>
                <TableCell className="text-sm">
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="w-fit text-xs">
                      {typeNames[p.type as keyof typeof typeNames]}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{catNames[p.category]}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{formatPrice(p.price)}</TableCell>
                <TableCell>
                  <HomePageToggle productId={p.id} initial={p.showOnHomePage} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/edit-product/${p.id}`}>
                      <Button variant="outline" size="sm">Sửa</Button>
                    </Link>
                    <DeleteProductButton productId={p.id} productTitle={p.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                  {products.length === 0 ? (
                    <>
                      Chưa có sản phẩm nào.{' '}
                      <Link href="/admin/add-product" className="text-brand hover:underline">
                        Thêm sản phẩm đầu tiên
                      </Link>
                    </>
                  ) : (
                    'Không tìm thấy sản phẩm phù hợp.'
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
