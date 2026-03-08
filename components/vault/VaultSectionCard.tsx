'use client'

import { useState } from 'react'
import VisibilityToggle from '@/components/ui/VisibilityToggle'
import type { VaultSection, VaultVisibility } from '@/types'

interface VaultSectionCardProps {
  section: VaultSection
  onUpdate: (id: string, data: Partial<VaultSection>) => Promise<void>
  hint?: string
}

export default function VaultSectionCard({ section, onUpdate, hint }: VaultSectionCardProps) {
  const [content, setContent] = useState(section.content)
  const [visibility, setVisibility] = useState<VaultVisibility>(section.visibility)
  const [saving, setSaving] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(section.id, { content, visibility })
    setSaving(false)
  }

  const handleConfirm = async () => {
    setConfirming(true)
    await onUpdate(section.id, { last_confirmed_at: new Date().toISOString() })
    setConfirming(false)
  }

  const handleVisibilityChange = async (v: VaultVisibility) => {
    setVisibility(v)
    await onUpdate(section.id, { visibility: v })
  }

  const lastConfirmed = section.last_confirmed_at
    ? new Date(section.last_confirmed_at).toLocaleDateString()
    : 'Never confirmed'

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-semibold text-text-primary">{section.label}</h3>
        <VisibilityToggle value={visibility} onChange={handleVisibilityChange} />
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={`Add information about your ${section.label.toLowerCase()}...`}
        rows={4}
        className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/60 resize-y"
      />

      {hint && (
        <p className="text-xs text-text-secondary italic border-l-2 border-accent/30 pl-3">{hint}</p>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-text-secondary">Last confirmed: {lastConfirmed}</p>
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="px-3 py-1.5 text-xs text-text-secondary border border-border rounded-lg hover:border-success/50 hover:text-success transition-colors disabled:opacity-50"
          >
            {confirming ? 'Confirming...' : 'Still accurate ✓'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (content === section.content && visibility === section.visibility)}
            className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
