import { useState } from 'react'
import { X } from 'lucide-react'
import { US_STATES } from '../../types/business'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/cn'

interface LocationStepProps {
  value: string[]
  onChange: (states: string[]) => void
}

export function LocationStep({ value, onChange }: LocationStepProps) {
  const [search, setSearch] = useState('')

  const filtered = US_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()),
  )

  function toggleState(code: string) {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code))
    } else {
      onChange([...value, code])
    }
  }

  function removeState(code: string) {
    onChange(value.filter((c) => c !== code))
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-content mb-1">Where does your business operate?</h2>
      <p className="text-sm text-content-secondary mb-4">Select all states where your business operates.</p>

      <Input
        label="Search states"
        hint="Select all states where your business operates"
        placeholder="e.g. California, TX..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((code) => {
            const state = US_STATES.find((s) => s.code === code)
            return (
              <Badge key={code} variant="primary" className="gap-1 pr-1">
                {state?.name ?? code}
                <button
                  type="button"
                  onClick={() => removeState(code)}
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

      <div className="mt-3 max-h-52 overflow-y-auto rounded-lg border border-border bg-surface-raised divide-y divide-border">
        {filtered.length === 0 ? (
          <p className="p-3 text-sm text-content-muted text-center">No states found</p>
        ) : (
          filtered.map((state) => {
            const isSelected = value.includes(state.code)
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
  )
}
