import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?:   boolean
  padding?: CardPadding
}

const paddingMap: Record<CardPadding, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export function Card({ className, hover = false, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface-raised border border-border shadow-card',
        paddingMap[padding],
        hover && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-card-lg transition-all duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
