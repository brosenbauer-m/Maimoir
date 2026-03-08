'use client'

import type { VaultVisibility } from '@/types'

interface VisibilityToggleProps {
  value: VaultVisibility
  onChange: (value: VaultVisibility) => void
}

const options: { value: VaultVisibility; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'discoverable_only', label: 'Discoverable' },
  { value: 'private', label: 'Private' },
]

export default function VisibilityToggle({ value, onChange }: VisibilityToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border overflow-hidden text-xs">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 transition-colors ${
            value === option.value
              ? 'bg-accent text-white'
              : 'bg-surface text-text-secondary hover:bg-card'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
