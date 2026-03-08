import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const serviceSupabase = createServiceClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { connectionId, accept } = await request.json()

  if (!connectionId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { data: connection } = await serviceSupabase
    .from('connection_interests')
    .select('*')
    .eq('id', connectionId)
    .single()

  if (!connection || connection.to_user_id !== user.id) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
  }

  if (!accept) {
    await serviceSupabase
      .from('connection_interests')
      .update({ status: 'declined' })
      .eq('id', connectionId)
    return NextResponse.json({ status: 'declined' })
  }

  // Accept: mark as owner_opened, check for reverse interest
  await serviceSupabase
    .from('connection_interests')
    .update({ status: 'owner_opened' })
    .eq('id', connectionId)

  // Check if from_user already indicated interest back
  const { data: reverse } = await serviceSupabase
    .from('connection_interests')
    .select('id')
    .eq('from_user_id', connection.to_user_id)
    .eq('to_user_id', connection.from_user_id)
    .single()

  if (reverse) {
    await Promise.all([
      serviceSupabase
        .from('connection_interests')
        .update({ status: 'matched' })
        .eq('id', connectionId),
      serviceSupabase
        .from('connection_interests')
        .update({ status: 'matched' })
        .eq('id', reverse.id),
    ])
    return NextResponse.json({ status: 'matched' })
  }

  return NextResponse.json({ status: 'owner_opened' })
}
