import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { formatPhoneNumber, formatDuration } from '@/lib/utils'
import { Phone, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'
import { format } from 'date-fns'

async function getCalls() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: memberships } = await (supabase.from('organization_members') as any)
    .select('organization_id')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) return []

  const orgIds = (memberships as Array<{ organization_id: string }>).map((m) => m.organization_id)

  const { data: calls } = await (supabase.from('calls') as any)
    .select('*, agent:agents(name)')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })
    .limit(50)

  return calls || []
}

function getStatusColor(status: string) {
  switch (status) {
    case 'connected':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
    case 'ended':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
    case 'ringing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
  }
}

export default async function CallsPage() {
  const calls = await getCalls()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calls</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all calls</p>
      </div>

      {calls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Phone className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No calls yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Direction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {calls.map((call: any) => (
                    <tr key={call.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {call.direction === 'inbound' ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <ArrowDownLeft className="h-4 w-4" />
                            Inbound
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-600">
                            <ArrowUpRight className="h-4 w-4" />
                            Outbound
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {call.agent && typeof call.agent === 'object' && 'name' in call.agent
                          ? call.agent.name
                          : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm">{formatPhoneNumber(call.from_number)}</span>
                          <span className="text-xs text-gray-500">→ {formatPhoneNumber(call.to_number)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(call.status)}`}>
                          {call.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {call.duration_seconds > 0 ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(call.duration_seconds)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.created_at ? format(new Date(call.created_at), 'MMM d, HH:mm') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/dashboard/calls/${call.id}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

