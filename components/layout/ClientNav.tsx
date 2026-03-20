'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ChevronDown, Heart, LayoutDashboard, Menu, Search, User } from 'lucide-react'
import { type Session } from 'next-auth'

import { logoutAction } from '@/actions/auth'
import { SearchBar } from '@/components/SearchBar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { categoriesByType, catNames,typeNames } from '@/lib/product-config'

interface Props {
  session: Session | null
}

const staticLinks = [
  { href: '/projects', label: 'Công trình' },
  { href: '/about', label: 'Giới thiệu' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function ClientNav({ session }: Props) {
  const pathname = usePathname()
  const [mobileSearchOpen,  setMobileSearchOpen]  = useState(false)
  const [mobileOpen,        setMobileOpen]        = useState(false)
  const [productsExpanded,  setProductsExpanded]  = useState(false)
  const [expandedTypes,     setExpandedTypes]     = useState<Record<string, boolean>>({})

  const isProductActive = Object.keys(typeNames).some((slug) =>
    pathname.startsWith(`/${slug}`)
  )

  function toggleType(slug: string) {
    setExpandedTypes((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  return (
    <div className="flex items-center gap-3">

      {/* ── Desktop Navigation ── */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>

          {/* Trang chủ */}
          <NavigationMenuItem>
            <Link
              href="/"
              className={`px-3 py-2 text-sm transition-colors rounded-sm ${
                isActive(pathname, '/') ? 'text-brand font-semibold' : 'hover:text-brand'
              }`}
            >
              Trang chủ
            </Link>
          </NavigationMenuItem>

          {/* Sản phẩm — dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={`text-sm px-3 py-2 h-auto bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent ${
                isProductActive ? 'text-brand font-semibold' : ''
              }`}
            >
              Sản phẩm
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 w-[480px]">
                {Object.entries(typeNames).map(([slug, name]) => {
                  const cats = categoriesByType[slug as keyof typeof categoriesByType] ?? []
                  return (
                    <div key={slug}>
                      <Link
                        href={`/${slug}`}
                        className={`block text-sm font-semibold mb-2 hover:text-brand transition-colors ${
                          pathname.startsWith(`/${slug}`) ? 'text-brand' : ''
                        }`}
                      >
                        {name}
                      </Link>
                      <ul className="space-y-1">
                        {cats.map((cat) => (
                          <li key={cat}>
                            <Link
                              href={`/${slug}/${cat}`}
                              className={`block text-xs hover:text-brand transition-colors ${
                                isActive(pathname, `/${slug}/${cat}`)
                                  ? 'text-brand font-medium'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {catNames[cat]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Giới thiệu · Công trình */}
          {staticLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 text-sm transition-colors rounded-sm ${
                  isActive(pathname, link.href) ? 'text-brand font-semibold' : 'hover:text-brand'
                }`}
              >
                {link.label}
              </Link>
            </NavigationMenuItem>
          ))}

        </NavigationMenuList>
      </NavigationMenu>

      {/* SearchBar — desktop inline */}
      <div className="hidden lg:flex">
        <SearchBar />
      </div>

      {/* Search trigger (mobile) */}
      <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Mở tìm kiếm" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="p-4 pt-12" aria-label="Tìm kiếm sản phẩm">
          <SearchBar
            variant="overlay"
            autoFocus
            onResultSelect={() => setMobileSearchOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Theme toggle (desktop) */}
      <div className="hidden lg:flex">
        <ThemeToggle />
      </div>

      {/* Wishlist icon (desktop) */}
      <Link
        href="/wishlist"
        aria-label="Danh sách yêu thích"
        className={`hidden lg:flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors ${
          isActive(pathname, '/wishlist') ? 'text-brand' : ''
        }`}
      >
        <Heart className="h-4 w-4" />
      </Link>

      {/* Login icon (desktop, guests only) */}
      {!session && (
        <Link href="/login" aria-label="Đăng nhập" className="hidden lg:flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors">
          <User className="h-4 w-4" />
        </Link>
      )}

      {/* Admin dropdown (desktop) */}
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden lg:flex gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Quản trị</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/products">Sản phẩm</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/add-product">Thêm sản phẩm</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/discount">Banner khuyến mãi</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/inquiries">Yêu cầu báo giá</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/analytics">Thống kê</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={logoutAction} className="w-full">
                <button type="submit" className="w-full text-left text-destructive">
                  Đăng xuất
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* ── Mobile hamburger ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu điều hướng'} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-72 flex flex-col p-0">
          {/* Sheet header — pr-12 clears the built-in × close button */}
          <div className="flex items-center h-14 px-5 pr-12 border-b shrink-0">
            <Link href="/" className="font-bold text-brand text-base" onClick={() => setMobileOpen(false)}>
              Nội thất Đại Dương
            </Link>
          </div>

          {/* Scrollable nav */}
          <nav className="flex-1 overflow-y-auto px-5 py-1">
            {/* Trang chủ */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-3 border-b transition-colors ${
                isActive(pathname, '/') ? 'text-brand' : 'hover:text-brand'
              }`}
            >
              Trang chủ
            </Link>

            {/* Sản phẩm — collapsible */}
            <div className="border-b">
              <button
                type="button"
                onClick={() => setProductsExpanded((v) => !v)}
                className={`w-full text-left text-sm font-medium py-3 flex items-center justify-between transition-colors ${
                  isProductActive ? 'text-brand' : 'hover:text-brand'
                }`}
              >
                Sản phẩm
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    productsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {productsExpanded && (
                <div className="pl-3 pb-2 space-y-0.5">
                  {Object.entries(typeNames).map(([slug, name]) => {
                    const cats = categoriesByType[slug as keyof typeof categoriesByType] ?? []
                    const typeActive = pathname.startsWith(`/${slug}`)
                    const typeExpanded = expandedTypes[slug] ?? typeActive
                    return (
                      <div key={slug}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/${slug}`}
                            onClick={() => setMobileOpen(false)}
                            className={`block text-sm py-1.5 flex-1 transition-colors ${
                              typeActive ? 'text-brand font-medium' : 'text-muted-foreground hover:text-brand'
                            }`}
                          >
                            {name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleType(slug)}
                            aria-expanded={typeExpanded}
                            className="p-1 text-muted-foreground hover:text-brand transition-colors"
                          >
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${typeExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        {typeExpanded && (
                          <div className="pl-3 space-y-0.5 pb-1">
                            {cats.map((cat) => (
                              <Link
                                key={cat}
                                href={`/${slug}/${cat}`}
                                onClick={() => setMobileOpen(false)}
                                className={`block text-xs py-1 transition-colors ${
                                  isActive(pathname, `/${slug}/${cat}`) ? 'text-brand font-medium' : 'text-muted-foreground hover:text-brand'
                                }`}
                              >
                                {catNames[cat]}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Static links */}
            {staticLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium py-3 border-b transition-colors ${
                  isActive(pathname, link.href) ? 'text-brand' : 'hover:text-brand'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Wishlist link (mobile) */}
            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium py-3 border-b transition-colors ${
                isActive(pathname, '/wishlist') ? 'text-brand' : 'hover:text-brand'
              }`}
            >
              <Heart className="h-4 w-4" />
              Yêu thích
            </Link>

            {/* Login link (mobile, guests only) */}
            {!session && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-3 border-t transition-colors hover:text-brand"
              >
                <User className="h-4 w-4" />
                Đăng nhập
              </Link>
            )}

            {/* Admin section (mobile) */}
            {session && (
              <div className="border-t mt-1 pt-2 space-y-0.5">
                <p className="text-xs text-muted-foreground px-0 py-1">Quản trị</p>
                {[
                  { href: '/admin/products',    label: 'Sản phẩm' },
                  { href: '/admin/add-product', label: 'Thêm sản phẩm' },
                  { href: '/admin/discount',    label: 'Banner khuyến mãi' },
                  { href: '/admin/inquiries',   label: 'Yêu cầu báo giá' },
                  { href: '/admin/analytics',   label: 'Thống kê' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm py-2 transition-colors ${
                      isActive(pathname, link.href) ? 'text-brand font-medium' : 'text-muted-foreground hover:text-brand'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <form action={logoutAction}>
                  <button type="submit" className="block text-sm py-2 w-full text-left text-destructive hover:opacity-80 transition-opacity">
                    Đăng xuất
                  </button>
                </form>
              </div>
            )}
          </nav>

          {/* Sheet footer: theme toggle */}
          <div className="border-t px-5 py-3 flex items-center justify-between shrink-0">
            <span className="text-xs text-muted-foreground">Giao diện</span>
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>

    </div>
  )
}
