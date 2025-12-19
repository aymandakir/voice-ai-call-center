import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Phone, Edit, Trash2 } from 'lucide-react'
import { formatPhoneNumber } from '@/lib/utils'
import type { Agent, PhoneNumber } from '@/lib/types/entities'

async function getAgents() {
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

  const { data: agents } = await (supabase.from('agents') as any)
    .select('*, phone_number:phone_numbers(*)')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })

  return (agents || []) as Array<Agent & { phone_number?: PhoneNumber | null }>
}

export default async function AgentsPage() {
  const agents = await getAgents()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your voice AI agents</p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        </Link>
      </div>

      {agents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No agents yet</p>
            <Link href="/dashboard/agents/new">
              <Button>Create Your First Agent</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    {agent.persona && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{agent.persona}</p>
                    )}
                  </div>
                  <span
                    className={`h-2 w-2 rounded-full ${agent.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
                    title={agent.is_active ? 'Active' : 'Inactive'}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {agent.phone_number && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{formatPhoneNumber(agent.phone_number.number)}</span>
                    </div>
                  )}
                  <div className="text-gray-600 dark:text-gray-400">
                    Language: <span className="font-medium">{agent.language}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Model: <span className="font-medium">{agent.model}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/agents/${agent.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

