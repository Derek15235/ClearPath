import {
  Heart,
  DollarSign,
  HardHat,
  Utensils,
  GraduationCap,
  Laptop,
  ShoppingBag,
  Factory,
  Building2,
  Truck,
  Scale,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'
import { INDUSTRIES } from '../../types/business'
import { Card } from '../ui/Card'
import { cn } from '../../lib/cn'

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  DollarSign,
  HardHat,
  Utensils,
  GraduationCap,
  Laptop,
  ShoppingBag,
  Factory,
  Building2,
  Truck,
  Scale,
  Briefcase,
}

interface IndustryStepProps {
  value: string
  onChange: (industry: string) => void
}

export function IndustryStep({ value, onChange }: IndustryStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-content mb-1">What industry are you in?</h2>
      <p className="text-sm text-content-secondary mb-4">Select the industry that best describes your business.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {INDUSTRIES.map((industry) => {
          const Icon = ICON_MAP[industry.icon] ?? Briefcase
          const isSelected = value === industry.id

          return (
            <Card
              key={industry.id}
              hover
              padding="sm"
              onClick={() => onChange(industry.id)}
              className={cn(
                'flex flex-col items-center gap-2 text-center cursor-pointer transition-all duration-150',
                isSelected && 'ring-2 ring-primary-500 bg-primary-600/5',
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6',
                  isSelected ? 'text-primary-400' : 'text-content-secondary',
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  isSelected ? 'text-primary-400' : 'text-content-secondary',
                )}
              >
                {industry.label}
              </span>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
