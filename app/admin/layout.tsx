import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ExternalLink } from 'lucide-react'

import { logoutAction } from '@/actions/auth'
import { AdminNav } from '@/components/admin/AdminNav'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

// auth() reads cookies — must be inside <Suspense> for cacheComponents compatibility
async function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login') // secondary guard; middleware is primary

  return (
    <div className="min-h-screen bg-muted/40">
      <nav className="border-b bg-background px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm">Admin</span>
          <AdminNav />
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" target="_blank" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Xem trang
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">Đăng xuất</Button>
          </form>
        </div>
      </nav>
      <main className="container mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  )
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  )
}
