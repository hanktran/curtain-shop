'use client'

import { useState } from 'react'
import Image from 'next/image'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: Props) {
  const [open, setOpen]   = useState(false)
  const [index, setIndex] = useState(0)

  function prev() { setIndex((i) => (i - 1 + images.length) % images.length) }
  function next() { setIndex((i) => (i + 1) % images.length) }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => { setIndex(i); setOpen(true) }}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-zoom-in group ${i === 0 ? 'col-span-2' : ''}`}
          >
            <Image
              src={url}
              alt={`${title} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            {i === 1 && images.length > 2 && (
              <div className="absolute bottom-2 right-2 rounded-md bg-black/60 text-white text-xs font-medium px-2 py-0.5">
                +{images.length - 2}
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl sm:max-w-5xl w-full p-0 overflow-hidden bg-black border-0 gap-0 rounded-xl"
        >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            {/* Main image */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={images[index]}
                alt={`${title} ${index + 1}`}
                fill
                sizes="(max-width: 1200px) 100vw, 896px"
                className="object-contain"
                priority
              />
              {/* Prev / Next */}
              {images.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
              {/* Counter */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                {index + 1} / {images.length}
              </span>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-1.5 p-2 bg-black/80 overflow-x-auto">
                {images.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`relative h-14 w-14 shrink-0 rounded overflow-hidden border-2 transition-colors ${i === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={url} alt={`${title} ${i + 1}`} fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/80 text-white p-1.5 transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogContent>
        </Dialog>
    </>
  )
}
