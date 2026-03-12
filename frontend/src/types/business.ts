import { z } from 'zod'

export const INDUSTRIES = [
  { id: 'healthcare', label: 'Healthcare', icon: 'Heart' },
  { id: 'finance', label: 'Finance', icon: 'DollarSign' },
  { id: 'construction', label: 'Construction', icon: 'HardHat' },
  { id: 'food_services', label: 'Food Services', icon: 'Utensils' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'technology', label: 'Technology', icon: 'Laptop' },
  { id: 'retail', label: 'Retail', icon: 'ShoppingBag' },
  { id: 'manufacturing', label: 'Manufacturing', icon: 'Factory' },
  { id: 'real_estate', label: 'Real Estate', icon: 'Building2' },
  { id: 'transportation', label: 'Transportation', icon: 'Truck' },
  { id: 'legal', label: 'Legal', icon: 'Scale' },
  { id: 'other', label: 'Other', icon: 'Briefcase' },
] as const

export const EMPLOYEE_RANGES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const

export const ENTITY_TYPES = [
  'LLC',
  'S-Corp',
  'C-Corp',
  'Sole Proprietor',
  'Partnership',
  'Nonprofit',
  'Other',
] as const

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const

export const businessProfileSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  states: z.array(z.string()).min(1, 'At least one state is required'),
  employeeCount: z.enum(EMPLOYEE_RANGES),
  entityType: z.enum(ENTITY_TYPES),
})

export type BusinessProfileForm = z.infer<typeof businessProfileSchema>

export type BusinessProfileResponse = {
  id: string
  user_id: string
  industry: string
  states: string[]
  employee_count: string
  entity_type: string
  created_at: string
  updated_at: string
}
