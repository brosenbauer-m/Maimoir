import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import ProfileChatSection from './ProfileChatSection'
import ContactLinks from '@/components/profile/ContactLinks'
import TagChip from '@/components/ui/TagChip'
import Link from 'next/link'
import type { User, VaultSection } from '@/types'

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServiceClient()
  const { data: user } = await supabase
    .from('users')
    .select('display_name, short_bio, avatar_url')
    .eq('username', params.username)
    .single<Pick<User, 'display_name' | 'short_bio' | 'avatar_url'>>()

  if (!user) return { title: 'Profile Not Found' }

  return {
    title: `${user.display_name}'s Maimoir`,
    description: user.short_bio ?? `Talk to ${user.display_name}'s AI representative`,
    openGraph: {
      title: `${user.display_name}'s Maimoir`,
      description: user.short_bio ?? `Talk to ${user.display_name}'s AI representative`,
      images: user.avatar_url ? [user.avatar_url] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.display_name}'s Maimoir`,
      description: user.short_bio ?? `Talk to ${user.display_name}'s AI representative`,
      images: user.avatar_url ? [user.avatar_url] : [],
    },
  }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = createServiceClient()

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single<User>()

  if (!user) notFound()

  const { data: sections } = await supabase
    .from('vault_sections')
    .select('*')
    .eq('user_id', user.id)
    .eq('visibility', 'public')
    .order('domain', { ascending: true })

  const publicSections = (sections as VaultSection[] | null) ?? []

  // Get skills and interests for tags display
  const skillsSection = publicSections.find(s => s.section_type === 'skills')
  const hobbiesSection = publicSections.find(s => s.section_type === 'hobbies')

  const skillTags = skillsSection?.content
    ? skillsSection.content.split(',').map(s => s.trim()).filter(Boolean).slice(0, 6)
    : []

  const hobbyTags = hobbiesSection?.content
    ? hobbiesSection.content.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4)
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-surface/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-accent-light">Maimoir</Link>
          <Link
            href="/signup"
            className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white text-sm rounded-lg transition-colors"
          >
            Create yours →
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column: Profile info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar + Name */}
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-border mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-accent-subtle flex items-center justify-center text-4xl font-bold text-accent-light border-4 border-border mx-auto mb-4">
                  {user.display_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <h1 className="text-2xl font-bold text-text-primary">{user.display_name}</h1>
              {user.short_bio && (
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">{user.short_bio}</p>
              )}
            </div>

            {/* Contact links */}
            {user.contact_links && user.contact_links.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-3">Connect</p>
                <ContactLinks links={user.contact_links} />
              </div>
            )}

            {/* Skills */}
            {skillTags.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-3">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillTags.map(tag => (
                    <TagChip key={tag} label={tag} variant="accent" />
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {hobbyTags.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-3">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {hobbyTags.map(tag => (
                    <TagChip key={tag} label={tag} />
                  ))}
                </div>
              </div>
            )}

            {/* Public section summaries */}
            {publicSections
              .filter(s => !['skills', 'hobbies'].includes(s.section_type) && s.content?.trim())
              .slice(0, 3)
              .map(section => (
                <div key={section.id} className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs text-text-secondary font-medium uppercase tracking-wide mb-2">{section.label}</p>
                  <p className="text-sm text-text-primary leading-relaxed line-clamp-3">{section.content}</p>
                </div>
              ))}
          </div>

          {/* Right column: Chat interface */}
          <div className="lg:col-span-3">
            <ProfileChatSection
              username={params.username}
              displayName={user.display_name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
