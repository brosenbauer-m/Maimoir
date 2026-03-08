'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User, ContactLink, DiscoverMode } from '@/types'

const PLATFORMS = ['Instagram', 'LinkedIn', 'WhatsApp', 'Twitter/X', 'GitHub', 'Email', 'Website', 'Other']

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [shortBio, setShortBio] = useState('')
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([])
  const [isDiscoverable, setIsDiscoverable] = useState(false)
  const [discoverMode, setDiscoverMode] = useState<DiscoverMode>('all')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase.from('users').select('*').eq('id', user.id).single<User>()
      if (data) {
        setProfile(data)
        setDisplayName(data.display_name)
        setShortBio(data.short_bio ?? '')
        setContactLinks(data.contact_links ?? [])
        setIsDiscoverable(data.is_discoverable)
        setDiscoverMode(data.discover_mode ?? 'all')
        setAvatarUrl(data.avatar_url)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    const ext = file.name.split('.').pop()
    const path = `avatars/${profile.id}.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (error) { alert('Upload failed'); return }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(urlData.publicUrl)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)

    await supabase
      .from('users')
      .update({
        display_name: displayName,
        short_bio: shortBio.substring(0, 160),
        contact_links: contactLinks,
        is_discoverable: isDiscoverable,
        discover_mode: discoverMode,
        avatar_url: avatarUrl,
      })
      .eq('id', profile.id)

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const addLink = () => setContactLinks(prev => [...prev, { platform: 'Website', url: '' }])
  const removeLink = (i: number) => setContactLinks(prev => prev.filter((_, idx) => idx !== i))
  const updateLink = (i: number, field: keyof ContactLink, value: string) =>
    setContactLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-text-secondary">Loading...</div>
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
        <h1 className="text-3xl font-bold text-text-primary">Edit Profile</h1>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-full bg-accent-subtle border-2 border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-accent-light text-3xl font-bold">{displayName?.[0]?.toUpperCase() ?? '?'}</span>
              )}
            </div>
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 border border-border hover:border-accent/50 text-text-secondary hover:text-text-primary text-sm rounded-lg transition-colors"
              >
                Change photo
              </button>
              <p className="text-xs text-text-secondary mt-1">JPG, PNG, GIF up to 5MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>

          {/* Display name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Display Name</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent/60"
            />
          </div>

          {/* Short bio */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Short Bio{' '}
              <span className="text-text-secondary font-normal">({shortBio.length}/160)</span>
            </label>
            <textarea
              value={shortBio}
              onChange={e => setShortBio(e.target.value.substring(0, 160))}
              rows={3}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent/60 resize-none"
              placeholder="A short description shown on your public profile"
            />
          </div>

          {/* Contact links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-text-primary">Contact Links</label>
              <button onClick={addLink} className="text-xs text-accent-light hover:underline">+ Add link</button>
            </div>
            <div className="space-y-2">
              {contactLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <select
                    value={link.platform}
                    onChange={e => updateLink(i, 'platform', e.target.value)}
                    className="bg-surface border border-border rounded-lg px-2 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/60"
                  >
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input
                    value={link.url}
                    onChange={e => updateLink(i, 'url', e.target.value)}
                    placeholder="URL or handle"
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/60"
                  />
                  <button
                    onClick={() => removeLink(i)}
                    className="text-text-secondary hover:text-error px-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Discoverability */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-primary">Discoverable</label>
              <button
                onClick={() => setIsDiscoverable(!isDiscoverable)}
                className={`w-12 h-6 rounded-full transition-colors ${isDiscoverable ? 'bg-accent' : 'bg-border'} relative`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isDiscoverable ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-text-secondary mb-3">Allow others to find you on the Discover page</p>

            {isDiscoverable && (
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">Discover Mode</label>
                <div className="flex gap-2">
                  {(['all', 'professional', 'personal'] as DiscoverMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setDiscoverMode(mode)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                        discoverMode === mode
                          ? 'bg-accent text-white border-accent'
                          : 'border-border text-text-secondary hover:border-accent/50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {success && (
            <div className="text-success text-sm bg-success/10 border border-success/30 rounded-lg px-3 py-2">
              Profile saved successfully ✓
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
