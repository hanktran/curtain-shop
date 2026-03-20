import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 p-1">
            <Skeleton className="aspect-[4/3] rounded-xl" />
            <Skeleton className="h-4 w-3/4 mx-2" />
            <Skeleton className="h-4 w-1/4 mx-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
