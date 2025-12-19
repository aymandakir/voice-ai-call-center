import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPhoneNumber, formatDuration } from '@/lib/utils'
import { ArrowLeft, Phone, Clock, Tag } from 'lucide-react'
import { format } from 'date-fns'

async function getCall(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: memberships } = await (supabase.from('organization_members') as any)
    .select('organization_id')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) return null

  const orgIds = (memberships as Array<{ organization_id: string }>).map((m) => m.organization_id)

  const { data: call } = await (supabase.from('calls') as any)
    .select('*, agent:agents(*), events:call_events(*)')
    .eq('id', id)
    .in('organization_id', orgIds)
    .single()

  return call
}

export default async function CallDetailPage({ params }: { params: { id: string } }) {
  const call = await getCall(params.id)

  if (!call) {
    notFound()
  }

  const agent = call.agent && typeof call.agent === 'object' && 'name' in call.agent ? call.agent : null
  const events = Array.isArray(call.events) ? call.events : []

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link
          href="/dashboard/calls"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:underline dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calls
        </Link>
        <h1 className="text-3xl font-bold mt-2">Call Details</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Direction</p>
                <p className="font-medium">{call.direction === 'inbound' ? 'Inbound' : 'Outbound'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{call.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{formatPhoneNumber(call.from_number)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{formatPhoneNumber(call.to_number)}</p>
              </div>
              {agent && (
                <div>
                  <p className="text-sm text-gray-500">Agent</p>
                  <p className="font-medium">{agent.name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {call.duration_seconds > 0 ? formatDuration(call.duration_seconds) : 'N/A'}
                </p>
              </div>
              {call.started_at && (
                <div>
                  <p className="text-sm text-gray-500">Started</p>
                  <p className="font-medium">{format(new Date(call.started_at), 'PPpp')}</p>
                </div>
              )}
              {call.ended_at && (
                <div>
                  <p className="text-sm text-gray-500">Ended</p>
                  <p className="font-medium">{format(new Date(call.ended_at), 'PPpp')}</p>
                </div>
              )}
            </div>
            {call.outcome && (
              <div>
                <p className="text-sm text-gray-500">Outcome</p>
                <p className="font-medium capitalize">{call.outcome.replace('_', ' ')}</p>
              </div>
            )}
            {call.tags && call.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {call.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {call.summary && (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{call.summary}</p>
            </CardContent>
          </Card>
        )}

        {call.transcript && (
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{call.transcript}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Call Timeline</CardTitle>
              <CardDescription>Events during the call</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .sort((a: any, b: any) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
                  .map((event: any) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <div className="h-full w-px bg-gray-200 dark:bg-gray-800" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium capitalize">{event.event_type}</p>
                        <p className="text-sm text-gray-500">{format(new Date(event.occurred_at), 'PPpp')}</p>
                        {event.data && typeof event.data === 'object' && Object.keys(event.data).length > 0 && (
                          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded dark:bg-gray-900">
                            {JSON.stringify(event.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

