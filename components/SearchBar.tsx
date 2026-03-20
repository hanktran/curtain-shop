'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Search, X } from 'lucide-react'

import { searchProducts, type SearchResult } from '@/actions/search'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  variant?: 'inline' | 'overlay'
  autoFocus?: boolean
  onResultSelect?: () => void
}

export function SearchBar({ variant = 'inline', autoFocus = false, onResultSelect }: SearchBarProps) {
  const router = useRouter()
  const [results, setResults]   = useState<SearchResult[]>([])
  const [query,   setQuery]     = useState('')
  const [open,    setOpen]      = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const versionRef  = useRef(0)

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    setActiveIndex(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!q.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const version = ++versionRef.current
      startTransition(async () => {
        const data = await searchProducts(q)
        if (version !== versionRef.current) return // discard stale response
        setResults(data)
        setOpen(true)
        setActiveIndex(-1)
      })
    }, 300)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      const result = results[activeIndex]
      if (result) {
        router.push(result.href)
        setOpen(false)
        setQuery('')
        setActiveIndex(-1)
        onResultSelect?.()
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const listboxId = 'search-listbox'

  return (
    <div
      className={cn('relative', variant === 'inline' ? 'w-48 lg:w-64' : 'w-full')}
      role="search"
    >
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
      <Input
        role="combobox"
        aria-label="Tìm sản phẩm"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
        placeholder="Tìm sản phẩm…"
        className={cn('pl-8 pr-7 text-sm', variant === 'overlay' && 'h-10 text-base')}
        value={query}
        autoFocus={autoFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => { setOpen(false); setActiveIndex(-1) }, 150)}
        onFocus={() => { if (query.trim() && results.length > 0) setOpen(true) }}
      />
      {query && !isPending && (
        <button
          type="button"
          aria-label="Xóa tìm kiếm"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onMouseDown={(e) => {
            e.preventDefault() // prevent input blur before click fires
            setQuery('')
            setResults([])
            setOpen(false)
            setActiveIndex(-1)
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {isPending && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin text-xs">
          ⟳
        </span>
      )}
      {open && query.trim() && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Kết quả tìm kiếm"
          className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md z-50 max-h-64 overflow-y-auto"
        >
          {results.length > 0 && results.map((r, i) => (
            <Link
              key={r.href}
              id={`search-option-${i}`}
              href={r.href}
              role="option"
              aria-selected={i === activeIndex}
              className={`block px-3 py-2 text-sm truncate transition-colors ${
                i === activeIndex ? 'bg-brand text-white' : 'hover:bg-muted'
              }`}
              onClick={() => {
                setOpen(false)
                setQuery('')
                setActiveIndex(-1)
                onResultSelect?.()
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {r.label}
            </Link>
          ))}
          {results.length === 0 && isPending === false && (
            <p aria-live="polite" className="px-3 py-3 text-sm text-muted-foreground text-center">
              Không tìm thấy kết quả
            </p>
          )}
        </div>
      )}
    </div>
  )
}
