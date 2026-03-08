import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import ProfileCard from '@/components/ui/ProfileCard'
import NotificationsPanel from './NotificationsPanel'
import type { Notification, User } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceSupabase = createServiceClient()

  const [
    { data: profile },
    { data: notifications },
    { data: queryLogs },
    { data: suggestedUsers },
  ] = await Promise.all([
    serviceSupabase.from('users').select('*').eq('id', user.id).single<User>(),
    serviceSupabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(10),
    serviceSupabase
      .from('visitor_query_log')
      .select('topic_cluster, count')
      .eq('profile_user_id', user.id)
      .order('count', { ascending: false })
      .limit(5),
    serviceSupabase
      .from('users')
      .select('*')
      .eq('is_discoverable', true)
      .neq('id', user.id)
      .limit(6),
  ])

  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://maimoir.app'}/${profile?.username ?? ''}`

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-accent-light">Maimoir</Link>
          <div className="flex items-center gap-4">
            <Link href="/vault" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Vault</Link>
            <Link href="/profile" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Profile</Link>
            <Link href="/discover" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Discover</Link>
            <Link href="/settings" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Settings</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome back, {profile?.display_name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-text-secondary mt-1">Here&apos;s what&apos;s been happening with your Maimoir</p>
        </div>

        {/* Share URL */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-medium text-text-primary mb-3">Your Maimoir profile</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-secondary font-mono truncate">
              {profileUrl}
            </div>
            <a
              href={`/${profile?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
            >
              View Profile
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
            <NotificationsPanel initialNotifications={(notifications as Notification[] | null) ?? []} />
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-text-primary">This week</h2>
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div>
                <p className="text-3xl font-bold text-accent-light">
                  {queryLogs?.reduce((acc, q) => acc + (q.count ?? 0), 0) ?? 0}
                </p>
                <p className="text-sm text-text-secondary">Visitor conversations</p>
              </div>
              {queryLogs && queryLogs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-text-primary mb-2">Top topics asked</p>
                  <div className="space-y-1.5">
                    {queryLogs.slice(0, 3).map((q, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-text-secondary">{q.topic_cluster}</span>
                        <span className="text-accent-light font-medium">{q.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href="/vault"
                className="flex-1 text-center py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Edit Vault
              </Link>
              <Link
                href="/profile"
                className="flex-1 text-center py-2.5 border border-border hover:border-accent/50 text-text-secondary hover:text-text-primary text-sm font-medium rounded-lg transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Suggested Connections */}
        {suggestedUsers && suggestedUsers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Suggested connections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(suggestedUsers as User[]).map(u => (
                <ProfileCard key={u.id} user={u} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
