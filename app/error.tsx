'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center min-h-[65vh] text-center gap-4">
      <p className="text-6xl font-bold text-destructive/20 select-none">!</p>
        <h2 className="text-xl font-bold -mt-2">Đã có lỗi xảy ra</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
          {error.message || 'Vui lòng thử lại hoặc quay về trang chủ.'}
      </p>
        <Button onClick={reset}>Thử lại</Button>
    </div>
  )
}
