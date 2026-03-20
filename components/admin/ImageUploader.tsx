'use client'
import Image from 'next/image'

import { X } from 'lucide-react'

import { UploadDropzone } from '@/lib/uploadthing'

interface Props {
  onUploadComplete: (urls: string[]) => void
  existingImages?: string[]
  onRemoveImage?: (url: string) => void
}

export function ImageUploader({ onUploadComplete, existingImages, onRemoveImage }: Props) {
  return (
    <div className="space-y-4">
      {existingImages?.length ? (
        <div className="grid grid-cols-4 gap-2">
          {existingImages.map((url) => (
            <div key={url} className="relative group">
              <Image
                src={url}
                alt=""
                width={120}
                height={120}
                className="rounded aspect-square object-cover w-full"
              />
              {onRemoveImage && (
                <button
                  type="button"
                  onClick={() => onRemoveImage(url)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Xóa ảnh"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : null}
      <UploadDropzone
        endpoint="productImages"
        onClientUploadComplete={(res) => onUploadComplete(res.map((f) => f.ufsUrl))}
        onUploadError={(err) => console.error(err)}
        appearance={{
          button: 'bg-brand text-white hover:bg-brand-dark',
        }}
      />
    </div>
  )
}
