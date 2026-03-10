import { EMPLOYEE_RANGES } from '../../types/business'
import { cn } from '../../lib/cn'

const RANGE_DESCRIPTIONS: Partial<Record<string, string>> = {
  '1-10': 'Small team or solo',
  '11-50': 'ACA threshold at 50+',
  '51-200': 'Mid-size business',
  '201-500': 'Larger organization',
  '500+': 'Enterprise',
}

interface SizeStepProps {
  value: string
  onChange: (range: string) => void
}

export function SizeStep({ value, onChange }: SizeStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-content mb-1">How many employees do you have?</h2>
      <p className="text-sm text-content-secondary mb-4">This helps determine which regulations apply to your business.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EMPLOYEE_RANGES.map((range) => {
          const isSelected = value === range
          const description = RANGE_DESCRIPTIONS[range]

          return (
            <button
              key={range}
              type="button"
              onClick={() => onChange(range)}
              className={cn(
                'flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                isSelected
                  ? 'ring-2 ring-primary-500 bg-primary-600/10 border-primary-500 text-primary-400'
                  : 'border-border bg-surface-raised text-content hover:bg-surface-overlay',
              )}
            >
              <span className="font-semibold text-base">{range}</span>
              {description && (
                <span
                  className={cn(
                    'text-xs mt-0.5',
                    isSelected ? 'text-primary-400/70' : 'text-content-muted',
                  )}
                >
                  {description}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
