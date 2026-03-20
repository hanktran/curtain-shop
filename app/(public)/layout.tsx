import { Suspense } from 'react'

import { DiscountBanner } from '@/components/layout/DiscountBanner'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ZaloButton } from '@/components/ZaloButton'
import { auth } from '@/lib/auth'
import { getDiscount } from '@/lib/queries'

// Separate async component so auth() (cookie read) is inside <Suspense>
// This allows the rest of the layout to be pre-rendered statically.
async function AuthedHeader() {
  const session = await auth()
  return <Header session={session} />
}

// Public layout: applies only to customer-facing routes.
// Admin routes (app/admin/) use their own layout with no public chrome.
export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const discount = await getDiscount()

  return (
    <>
      <div className="sticky top-0 z-50">
        <DiscountBanner discount={discount} />
        <Suspense fallback={
          <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
              <span className="text-xl font-bold text-brand">Nội thất Đại Dương</span>
            </div>
          </header>
        }>
          <AuthedHeader />
        </Suspense>
      </div>
      <main id="main-content" className="flex-1">{children}</main>
      <ZaloButton />
      <Footer />
    </>
  )
}
