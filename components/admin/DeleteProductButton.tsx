'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { deleteProduct } from '@/actions/product'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface Props {
  productId: string
  productTitle: string
}

export function DeleteProductButton({ productId, productTitle }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProduct(productId)
      if (result && 'success' in result) {
        toast.success('Đã xóa sản phẩm')
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
          <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
          <AlertDialogDescription>
            Thao tác này sẽ xóa vĩnh viễn <strong>{productTitle}</strong> và không thể hoàn tác.
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
