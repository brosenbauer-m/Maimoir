import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateNotifications } from '@/lib/notifications'
import type { User } from '@/types'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Get all user IDs
  const { data: users, error } = await supabase
    .from('users')
    .select('id')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  const results: { userId: string; status: string }[] = []

  for (const user of (users as Pick<User, 'id'>[] | null) ?? []) {
    try {
      await generateNotifications(user.id)
      results.push({ userId: user.id, status: 'ok' })
    } catch (e) {
      results.push({ userId: user.id, status: 'error' })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
