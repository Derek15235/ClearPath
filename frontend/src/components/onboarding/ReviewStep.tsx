import { INDUSTRIES } from '../../types/business'
import type { BusinessProfileForm } from '../../types/business'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { US_STATES } from '../../types/business'

interface ReviewStepProps {
  data: BusinessProfileForm
  onConfirm: () => void
  onEdit: (step: number) => void
  isSubmitting: boolean
}

export function ReviewStep({ data, onConfirm, onEdit, isSubmitting }: ReviewStepProps) {
  const industry = INDUSTRIES.find((i) => i.id === data.industry)

  const stateNames = data.states.map(
    (code) => US_STATES.find((s) => s.code === code)?.name ?? code,
  )

  return (
    <div>
      <h2 className="text-lg font-semibold text-content mb-1">Review your information</h2>
      <p className="text-sm text-content-secondary mb-4">Confirm your business profile details below.</p>

      <Card padding="sm" className="space-y-4">
        {/* Industry */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-content-muted uppercase tracking-wide font-medium">Industry</p>
            <p className="text-sm text-content mt-0.5">{industry?.label ?? data.industry}</p>
          </div>
          <button
            type="button"
            onClick={() => onEdit(0)}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors shrink-0"
          >
            Edit
          </button>
        </div>

        <div className="border-t border-border" />

        {/* States */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-content-muted uppercase tracking-wide font-medium">Operating States</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {stateNames.map((name) => (
                <Badge key={name} variant="primary">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors shrink-0"
          >
            Edit
          </button>
        </div>

        <div className="border-t border-border" />

        {/* Employees */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-content-muted uppercase tracking-wide font-medium">Employees</p>
            <p className="text-sm text-content mt-0.5">{data.employeeCount}</p>
          </div>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors shrink-0"
          >
            Edit
          </button>
        </div>

        <div className="border-t border-border" />

        {/* Entity Type */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-content-muted uppercase tracking-wide font-medium">Entity Type</p>
            <p className="text-sm text-content mt-0.5">{data.entityType}</p>
          </div>
          <button
            type="button"
            onClick={() => onEdit(3)}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors shrink-0"
          >
            Edit
          </button>
        </div>
      </Card>

      <Button
        variant="primary"
        loading={isSubmitting}
        onClick={onConfirm}
        className="w-full mt-6"
        size="lg"
      >
        Complete Setup
      </Button>
    </div>
  )
}
