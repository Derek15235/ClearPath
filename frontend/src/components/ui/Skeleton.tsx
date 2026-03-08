import { cn } from '../../lib/cn'

interface SkeletonProps {
  className?:  string
  'aria-label'?: string
}

export function Skeleton({ className, 'aria-label': ariaLabel }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel ?? 'Loading...'}
      className={cn('animate-pulse rounded-lg bg-surface-raised', className)}
    />
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading page...">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}
