import { useState, useEffect, useCallback } from 'react'
import { X, Settings } from 'lucide-react'
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
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { ErrorState } from '../components/ui/ErrorState'
import { cn } from '../lib/cn'
import { apiFetch } from '../lib/api'
import {
  INDUSTRIES,
  EMPLOYEE_RANGES,
  ENTITY_TYPES,
  US_STATES,
  type BusinessProfileResponse,
  type BusinessProfileForm,
} from '../types/business'

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

function profileToForm(profile: BusinessProfileResponse): BusinessProfileForm {
  return {
    industry: profile.industry,
    states: profile.states,
    employeeCount: profile.employee_count as BusinessProfileForm['employeeCount'],
    entityType: profile.entity_type as BusinessProfileForm['entityType'],
  }
}

function formToApiBody(form: BusinessProfileForm) {
  return {
    industry: form.industry,
    states: form.states,
    employee_count: form.employeeCount,
    entity_type: form.entityType,
  }
}

function formsEqual(a: BusinessProfileForm, b: BusinessProfileForm): boolean {
  return (
    a.industry === b.industry &&
    a.employeeCount === b.employeeCount &&
    a.entityType === b.entityType &&
    a.states.length === b.states.length &&
    a.states.every((s) => b.states.includes(s))
  )
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedForm, setSavedForm] = useState<BusinessProfileForm | null>(null)
  const [form, setForm] = useState<BusinessProfileForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [stateSearch, setStateSearch] = useState('')

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const profile = await apiFetch<BusinessProfileResponse>('/api/business-profile')
      const mapped = profileToForm(profile)
      setSavedForm(mapped)
      setForm(mapped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  async function handleSave() {
    if (!form) return
    setSaving(true)
    setSaveSuccess(false)
    try {
      await apiFetch('/api/business-profile', {
        method: 'PUT',
        body: JSON.stringify(formToApiBody(form)),
      })
      setSavedForm(form)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      // Fire-and-forget rule engine re-trigger
      void apiFetch('/api/compliance/generate', { method: 'POST' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" description="Manage your business profile" />
        <div className="space-y-4 max-w-3xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && !form) {
    return (
      <div>
        <PageHeader title="Settings" description="Manage your business profile" />
        <ErrorState
          title="Could not load profile"
          message={error}
          onRetry={fetchProfile}
        />
      </div>
    )
  }

  if (!form || !savedForm) return null

  const hasChanges = !formsEqual(form, savedForm)

  const filteredStates = US_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(stateSearch.toLowerCase()),
  )

  function toggleState(code: string) {
    if (!form) return
    setForm({
      ...form,
      states: form.states.includes(code)
        ? form.states.filter((c) => c !== code)
        : [...form.states, code],
    })
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your business profile"
        actions={
          <Settings className="w-5 h-5 text-content-muted" aria-hidden="true" />
        }
      />

      <div className="max-w-3xl space-y-6">
        <Card padding="none" className="p-6">
          <h2 className="text-base font-semibold text-content mb-5">Business Profile</h2>

          {/* Industry */}
          <div className="mb-6">
            <p className="text-sm font-medium text-content mb-2">Industry</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {INDUSTRIES.map((industry) => {
                const Icon = ICON_MAP[industry.icon] ?? Briefcase
                const isSelected = form.industry === industry.id
                return (
                  <button
                    key={industry.id}
                    type="button"
                    onClick={() => setForm({ ...form, industry: industry.id })}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center',
                      'text-xs font-medium transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isSelected
                        ? 'ring-2 ring-primary-500 bg-primary-600/5 border-primary-500 text-primary-400'
                        : 'border-border bg-surface text-content-secondary hover:bg-surface-overlay hover:text-content',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        isSelected ? 'text-primary-400' : 'text-content-muted',
                      )}
                      aria-hidden="true"
                    />
                    {industry.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* States */}
          <div className="mb-6">
            <p className="text-sm font-medium text-content mb-2">Operating States</p>
            {form.states.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.states.map((code) => {
                  const state = US_STATES.find((s) => s.code === code)
                  return (
                    <Badge key={code} variant="primary" className="gap-1 pr-1">
                      {state?.name ?? code}
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            states: form.states.filter((c) => c !== code),
                          })
                        }
                        className="ml-0.5 hover:text-primary-300 transition-colors"
                        aria-label={`Remove ${state?.name ?? code}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}
            <Input
              placeholder="Search states..."
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
            />
            <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-border bg-surface-raised divide-y divide-border">
              {filteredStates.length === 0 ? (
                <p className="p-3 text-sm text-content-muted text-center">No states found</p>
              ) : (
                filteredStates.map((state) => {
                  const isSelected = form.states.includes(state.code)
                  return (
                    <button
                      key={state.code}
                      type="button"
                      onClick={() => toggleState(state.code)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors',
                        isSelected
                          ? 'bg-primary-600/10 text-primary-400'
                          : 'text-content hover:bg-surface-overlay',
                      )}
                    >
                      <span>{state.name}</span>
                      <span className="text-xs text-content-muted">{state.code}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Employee Count */}
          <div className="mb-6">
            <p className="text-sm font-medium text-content mb-2">Employee Count</p>
            <div className="flex flex-wrap gap-2">
              {EMPLOYEE_RANGES.map((range) => {
                const isSelected = form.employeeCount === range
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setForm({ ...form, employeeCount: range })}
                    className={cn(
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isSelected
                        ? 'ring-2 ring-primary-500 bg-primary-600/10 border-primary-500 text-primary-400'
                        : 'border-border bg-surface-raised text-content hover:bg-surface-overlay',
                    )}
                  >
                    {range}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Entity Type */}
          <div className="mb-6">
            <p className="text-sm font-medium text-content mb-2">Entity Type</p>
            <div className="flex flex-wrap gap-2">
              {ENTITY_TYPES.map((entityType) => {
                const isSelected = form.entityType === entityType
                return (
                  <button
                    key={entityType}
                    type="button"
                    onClick={() => setForm({ ...form, entityType: entityType as BusinessProfileForm['entityType'] })}
                    className={cn(
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150',
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

          {/* Save */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={!hasChanges || saving}
            >
              Save Changes
            </Button>
            {saveSuccess && (
              <p className="text-sm text-emerald-400 font-medium">Profile saved successfully</p>
            )}
            {error && !saveSuccess && (
              <p className="text-sm text-error font-medium">{error}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
