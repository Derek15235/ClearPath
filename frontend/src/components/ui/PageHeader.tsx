import { cn } from '../../lib/cn'

interface PageHeaderProps {
  title:        string
  description?: string
  className?:   string
  actions?:     React.ReactNode
}

export function PageHeader({ title, description, className, actions }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-8', className)}>
      <div>
        <h1 className="text-2xl font-semibold text-content">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-content-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
