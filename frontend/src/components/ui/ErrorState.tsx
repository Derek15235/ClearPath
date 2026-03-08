import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ErrorStateProps {
  title?:     string
  message?:   string
  onRetry?:   () => void
  className?: string
}

export function ErrorState({
  title   = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="rounded-full bg-error/10 p-4 mb-4">
        <AlertTriangle className="w-8 h-8 text-error" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-content mb-2">{title}</h3>
      <p className="text-sm text-content-secondary mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
            bg-surface-raised border border-border text-sm font-medium
            text-content-secondary hover:text-content hover:bg-surface-overlay transition-colors"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  )
}
