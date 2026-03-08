'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    setDeleting(true)
    // In production, call a server-side function that deletes all user data
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-xl text-accent-light">Maimoir</Link>
          <Link href="/dashboard" className="text-text-secondary hover:text-text-primary text-sm transition-colors">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-text-primary">Account</h2>
          <button
            onClick={handleSignOut}
            className="w-full py-3 border border-border hover:border-accent/50 text-text-secondary hover:text-text-primary rounded-lg text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-card border border-error/30 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-error">Danger Zone</h2>
          <p className="text-sm text-text-secondary">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="py-2.5 px-5 border border-error/50 text-error hover:bg-error/10 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
