import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn', () => {
  it('merges conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('filters falsy values', () => {
    expect(cn('text-red-500', undefined, false, 'font-bold')).toBe('text-red-500 font-bold')
  })

  it('handles conditional classes via clsx', () => {
    const active = true
    expect(cn('base', active && 'active')).toBe('base active')
  })
})
