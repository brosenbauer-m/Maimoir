'use client'

import { useState } from 'react'
import VisibilityToggle from '@/components/ui/VisibilityToggle'
import type { VaultSection, VaultVisibility } from '@/types'

interface VaultSectionCardProps {
  section: VaultSection
  onUpdate: (id: string, data: Partial<VaultSection>) => Promise<void>
  hint?: string
}

// Privacy badge component
function PrivacyBadge({ visibility }: { visibility: VaultVisibility }) {
  const config = {
    public: { color: 'bg-badge-public/10 text-badge-public border-badge-public/30', label: 'Public' },
    discoverable: { color: 'bg-badge-discoverable/10 text-badge-discoverable border-badge-discoverable/30', label: 'Discoverable' },
    private: { color: 'bg-badge-private/10 text-badge-private border-badge-private/30', label: 'Private' },
  }

  const { color, label } = config[visibility]

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      {label}
    </span>
  )
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
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-soft">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-text-primary text-lg">{section.label}</h3>
          <PrivacyBadge visibility={visibility} />
        </div>
        <VisibilityToggle value={visibility} onChange={handleVisibilityChange} />
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={`Add information about your ${section.label.toLowerCase()}...`}
        rows={4}
        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-y transition-all"
      />

      {hint && (
        <p className="text-sm text-text-secondary italic border-l-2 border-accent pl-4">{hint}</p>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-text-muted">Last confirmed: {lastConfirmed}</p>
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="px-4 py-2 text-sm text-text-secondary border-2 border-border rounded-lg hover:border-success hover:text-success transition-all disabled:opacity-50"
          >
            {confirming ? 'Confirming...' : 'Still accurate ✓'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (content === section.content && visibility === section.visibility)}
            className="px-5 py-2 text-sm bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-all shadow-soft disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
