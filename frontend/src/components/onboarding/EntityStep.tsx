import { ENTITY_TYPES } from '../../types/business'
import { cn } from '../../lib/cn'

interface EntityStepProps {
  value: string
  onChange: (entityType: string) => void
}

export function EntityStep({ value, onChange }: EntityStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-content mb-1">What is your business entity type?</h2>
      <p className="text-sm text-content-secondary mb-4">Select the legal structure of your business.</p>
      <div className="flex flex-col gap-2">
        {ENTITY_TYPES.map((entityType) => {
          const isSelected = value === entityType

          return (
            <button
              key={entityType}
              type="button"
              onClick={() => onChange(entityType)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                isSelected
                  ? 'ring-2 ring-primary-500 bg-primary-600/10 border-primary-500 text-primary-400'
                  : 'border-border bg-surface-raised text-content hover:bg-surface-overlay',
              )}
            >
              {entityType}
            </button>
          )
        })}
      </div>
    </div>
  )
}
