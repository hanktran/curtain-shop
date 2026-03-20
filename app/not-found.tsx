import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center min-h-[65vh] text-center gap-4">
      <p className="text-8xl font-bold text-brand/20 select-none">404</p>
      <h2 className="text-2xl font-bold -mt-4">Không tìm thấy trang</h2>
      <p className="text-muted-foreground text-sm max-w-xs">
        Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <div className="flex gap-3 mt-2">
        <Button asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/curtains-blinds">Xem sản phẩm</Link>
        </Button>
      </div>
    </div>
  )
}
