import { NextResponse } from 'next/server'

import rateLimit from 'next-rate-limit'

import { auth } from '@/lib/auth'

// next-rate-limit uses in-memory storage and Auth.js credential callbacks use
// Node.js crypto APIs — both require Node.js runtime (default for proxy).
const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 })

export default auth(async (req) => {
  // Rate-limit login attempts — checkNext throws when limit exceeded
  if (req.method === 'POST' && req.nextUrl.pathname === '/login') {
    try {
      limiter.checkNext(req, 10) // 10 attempts/minute per IP (uses x-forwarded-for internally)
    } catch {
      return NextResponse.json(
        { error: 'Quá nhiều lần thử. Vui lòng thử lại sau.' },
        { status: 429 }
      )
    }
  }

  // Admin route protection — require authenticated ADMIN role
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!req.auth || req.auth.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
})

export const config = {
  // Only protect admin routes and rate-limit the login page.
  // Do NOT include public routes — running auth() on every public page
  // causes next-auth beta.30 to interfere with responses when a session exists.
  matcher: ['/admin', '/admin/:path+', '/login'],
}
