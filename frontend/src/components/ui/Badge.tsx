import { cn } from '../../lib/cn'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'primary'

interface BadgeProps {
  variant?:  BadgeVariant
  children:  React.ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  default: 'bg-surface-overlay text-content-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error:   'bg-error/10 text-error',
  primary: 'bg-primary-600/10 text-primary-400',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantMap[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
