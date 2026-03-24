import { cn } from '../../lib/cn'
import { Check } from 'lucide-react'

interface StepBarProps {
  currentStep: number
  steps: string[]
}

export function StepBar({ currentStep, steps }: StepBarProps) {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isFuture = index > currentStep

        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200',
                  isCompleted && 'bg-primary-600 text-white',
                  isActive && 'bg-primary-600 text-white ring-4 ring-primary-600/20',
                  isFuture && 'bg-surface-overlay text-content-muted border border-border',
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs font-medium hidden sm:block',
                  (isCompleted || isActive) ? 'text-primary-400' : 'text-content-muted',
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-colors duration-200',
                  index < currentStep ? 'bg-primary-600' : 'bg-border',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
