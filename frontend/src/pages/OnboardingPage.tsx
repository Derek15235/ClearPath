import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuthStore } from '../stores/authStore'
import { useOnboardingStore } from '../stores/onboardingStore'
import { apiFetch } from '../lib/api'
import type { BusinessProfileForm } from '../types/business'
import { PageSkeleton } from '../components/ui/Skeleton'
import { StepBar } from '../components/onboarding/StepBar'
import { IndustryStep } from '../components/onboarding/IndustryStep'
import { LocationStep } from '../components/onboarding/LocationStep'
import { SizeStep } from '../components/onboarding/SizeStep'
import { EntityStep } from '../components/onboarding/EntityStep'
import { ReviewStep } from '../components/onboarding/ReviewStep'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const STEP_LABELS = ['Industry', 'Location', 'Size', 'Entity', 'Review']

const EMPTY_FORM: BusinessProfileForm = {
  industry: '',
  states: [],
  employeeCount: '1-10',
  entityType: 'LLC',
}

function isStepValid(step: number, formData: BusinessProfileForm): boolean {
  switch (step) {
    case 0: return formData.industry.length > 0
    case 1: return formData.states.length > 0
    case 2: return formData.employeeCount.length > 0
    case 3: return formData.entityType.length > 0
    default: return true
  }
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuthStore()
  const { hasProfile, setHasProfile } = useOnboardingStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<BusinessProfileForm>({ ...EMPTY_FORM })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Auth guard
  if (authLoading) return <PageSkeleton />
  if (!session) {
    navigate('/auth', { replace: true })
    return null
  }

  // Already onboarded guard
  if (hasProfile === true) {
    navigate('/dashboard', { replace: true })
    return null
  }

  function goToStep(step: number) {
    setDirection(step > currentStep ? 1 : -1)
    setCurrentStep(step)
  }

  function handleNext() {
    if (currentStep < STEP_LABELS.length - 1) {
      goToStep(currentStep + 1)
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }

  async function handleConfirm() {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await apiFetch('/api/business-profile/', {
        method: 'POST',
        body: JSON.stringify({
          industry: formData.industry,
          states: formData.states,
          employee_count: formData.employeeCount,
          entity_type: formData.entityType,
        }),
      })

      // Fire-and-forget compliance generation
      apiFetch('/api/compliance/generate', { method: 'POST' }).catch(() => {
        // Intentionally ignored -- rule engine fires in background
      })

      setHasProfile(true)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const isReviewStep = currentStep === STEP_LABELS.length - 1
  const canGoNext = isStepValid(currentStep, formData)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-content tracking-tight">ClearPath</h1>
          <p className="text-sm text-content-secondary mt-1">Let's set up your business profile</p>
        </div>

        <Card padding="none" className="p-6 sm:p-8">
          <StepBar currentStep={currentStep} steps={STEP_LABELS} />

          {/* Step content with slide transitions */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ x: direction * 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -200, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {currentStep === 0 && (
                  <IndustryStep
                    value={formData.industry}
                    onChange={(industry) => setFormData((f) => ({ ...f, industry }))}
                  />
                )}
                {currentStep === 1 && (
                  <LocationStep
                    value={formData.states}
                    onChange={(states) => setFormData((f) => ({ ...f, states }))}
                  />
                )}
                {currentStep === 2 && (
                  <SizeStep
                    value={formData.employeeCount}
                    onChange={(employeeCount) => setFormData((f) => ({ ...f, employeeCount }))}
                  />
                )}
                {currentStep === 3 && (
                  <EntityStep
                    value={formData.entityType}
                    onChange={(entityType) => setFormData((f) => ({ ...f, entityType }))}
                  />
                )}
                {currentStep === 4 && (
                  <ReviewStep
                    data={formData}
                    onConfirm={handleConfirm}
                    onEdit={goToStep}
                    isSubmitting={isSubmitting}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {submitError && (
            <p className="mt-3 text-sm text-error text-center">{submitError}</p>
          )}

          {/* Navigation buttons (hidden on review step which has its own confirm button) */}
          {!isReviewStep && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canGoNext}
              >
                Next
              </Button>
            </div>
          )}
          {isReviewStep && currentStep > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-content-secondary hover:text-content transition-colors"
              >
                Back to edit
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
