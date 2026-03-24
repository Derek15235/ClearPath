import { create } from 'zustand'

interface OnboardingState {
  hasProfile: boolean | null
  setHasProfile: (val: boolean) => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasProfile: null,
  setHasProfile: (val) => set({ hasProfile: val }),
}))
