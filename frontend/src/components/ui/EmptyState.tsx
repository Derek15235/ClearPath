import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon?:        LucideIcon
  heading:      string
  description?: string
  className?:   string
  action?:      React.ReactNode
}

export function EmptyState({ icon: Icon, heading, description, className, action }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
      {Icon && (
        <div className="rounded-full bg-surface-raised border border-border p-5 mb-5">
          <Icon className="w-8 h-8 text-content-muted" aria-hidden="true" />
        </div>
      )}
      <h2 className="text-lg font-semibold text-content mb-2">{heading}</h2>
      {description && (
        <p className="text-sm text-content-secondary max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}
