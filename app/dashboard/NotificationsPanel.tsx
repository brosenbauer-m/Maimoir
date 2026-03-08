'use client'

import { useState } from 'react'
import NotificationItem from '@/components/ui/NotificationItem'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types'

interface Props {
  initialNotifications: Notification[]
}

export default function NotificationsPanel({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const supabase = createClient()

  const handleDismiss = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-text-secondary">You&apos;re all caught up! ✨</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map(n => (
        <NotificationItem
          key={n.id}
          notification={n}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  )
}
