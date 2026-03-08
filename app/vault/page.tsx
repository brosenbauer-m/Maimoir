'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import VaultSectionCard from '@/components/vault/VaultSectionCard'
import type { VaultSection } from '@/types'

const SECTION_HINTS: Record<string, string> = {
  skills: "Try describing not just what tools you know, but what problems you're best at solving.",
  current_role: "Include your title, company, and what you're working on day-to-day.",
  work_history: "Highlight key roles, what you achieved, and what you learned.",
  bio: "Write as you'd introduce yourself to someone you just met — warm and genuine.",
  values: "What principles guide your decisions? What do you care about deeply?",
  looking_for: "Be specific about what kind of people or opportunities you're seeking.",
  hobbies: "Don't just list activities — share what excites you about them.",
}

type Tab = 'professional' | 'personal'

export default function VaultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const welcome = searchParams.get('welcome') === '1'

  const [sections, setSections] = useState<VaultSection[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('professional')
  const [showWelcome, setShowWelcome] = useState(welcome)
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('vault_sections')
        .select('*')
        .eq('user_id', user.id)
        .order('domain', { ascending: true })
        .order('created_at', { ascending: true })

      setSections(data as VaultSection[] ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const updateSection = useCallback(async (id: string, updates: Partial<VaultSection>) => {
    const { data } = await supabase
      .from('vault_sections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (data) {
      setSections(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
    }
  }, [supabase])

  const addCustomSection = async () => {
    if (!userId) return
    const label = prompt('Section name:')
    if (!label) return

    const { data } = await supabase
      .from('vault_sections')
      .insert({
        user_id: userId,
        domain: activeTab,
        section_type: 'custom',
        label,
        content: '',
        visibility: 'public',
        source: 'manual',
      })
      .select()
      .single()

    if (data) setSections(prev => [...prev, data as VaultSection])
  }

  const loadPreview = async () => {
    if (!userId) return
    const publicSections = sections
      .filter(s => s.visibility !== 'private' && s.content?.trim().length > 0)
      .map(s => `${s.label.toUpperCase()}:\n${s.content}`)
      .join('\n\n')
    setPreviewContent(publicSections || 'No public content yet.')
    setShowPreview(true)
  }

  const filtered = sections.filter(s => s.domain === activeTab)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading your vault...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">Welcome to your Vault!</h2>
            <p className="text-text-secondary mb-6">
              This is where you feed your Maimoir. The more you add, the better it can represent you. Start with a few sections and build from there.
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
            >
              Let&apos;s go! →
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-xl text-accent-light">Maimoir</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Dashboard</Link>
            <button
              onClick={loadPreview}
              className="text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              Preview
            </button>
          </div>
        </div>
      </nav>

      {/* Preview Panel */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 px-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-text-primary">Your Maimoir&apos;s knowledge preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-text-secondary hover:text-error">✕</button>
            </div>
            <p className="text-xs text-text-secondary mb-4">This is the information visible to your Maimoir (public + discoverable sections)</p>
            <pre className="flex-1 overflow-y-auto text-xs text-text-secondary font-mono whitespace-pre-wrap bg-surface rounded-lg p-4">
              {previewContent}
            </pre>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">My Vault</h1>
            <p className="text-text-secondary mt-1">Your Maimoir only knows what you put here</p>
          </div>
          <button
            onClick={loadPreview}
            className="px-4 py-2 border border-border hover:border-accent/50 text-text-secondary hover:text-text-primary text-sm rounded-lg transition-colors hidden sm:block"
          >
            Live Preview
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1 w-fit">
          {(['professional', 'personal'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {filtered.map(section => (
            <VaultSectionCard
              key={section.id}
              section={section}
              onUpdate={updateSection}
              hint={SECTION_HINTS[section.section_type]}
            />
          ))}
        </div>

        {/* Add custom section */}
        <button
          onClick={addCustomSection}
          className="mt-6 w-full py-3 border border-dashed border-border hover:border-accent/50 text-text-secondary hover:text-text-primary rounded-xl text-sm transition-colors"
        >
          + Add Custom Section
        </button>
      </div>
    </div>
  )
}
