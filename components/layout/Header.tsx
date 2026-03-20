import Link from 'next/link'

import { type Session } from 'next-auth'

import { ClientNav } from './ClientNav'

interface Props {
  session: Session | null
}

export function Header({ session }: Props) {
  return (
    <header className="border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-bold text-brand shrink-0 text-base sm:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm px-1">
          <span className="sm:hidden">Đại Dương</span>
          <span className="hidden sm:inline">Nội thất Đại Dương</span>
        </Link>
        <ClientNav session={session} />
      </div>
    </header>
  )
}
