'use client'
import { useState, useTransition } from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginFormInner() {
  const [error, setError]            = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/admin/products'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email    = formData.get('email') as string
    const password = formData.get('password') as string

    startTransition(async () => {
      setError(null)
      // redirect: false — we handle the redirect ourselves so we can show errors
      const result = await signIn('credentials', { email, password, redirect: false })
      if (!result || result.error) {
        setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
        return
      }
      // Full page navigation so the browser sends the new session cookie to
      // the middleware — client-side router.push() can race with cookie writes.
      window.location.href = callbackUrl
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </Button>
    </form>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  )
}
