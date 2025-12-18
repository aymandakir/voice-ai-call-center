import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Users, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getStats() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's organizations
  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) return null

  const orgIds = memberships.map((m) => m.organization_id)

  // Get total calls
  const { count: totalCalls } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .in('organization_id', orgIds)

  // Get calls this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: callsThisMonth } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true })
    .in('organization_id', orgIds)
    .gte('created_at', startOfMonth.toISOString())

  // Get total agents
  const { count: totalAgents } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .in('organization_id', orgIds)

  // Get average call duration
  const { data: calls } = await supabase
    .from('calls')
    .select('duration_seconds')
    .in('organization_id', orgIds)
    .gte('created_at', startOfMonth.toISOString())
    .not('duration_seconds', 'is', null)

  const avgDuration =
    calls && calls.length > 0
      ? Math.round(calls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0) / calls.length)
      : 0

  return {
    totalCalls: totalCalls || 0,
    callsThisMonth: callsThisMonth || 0,
    totalAgents: totalAgents || 0,
    avgDuration,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first AI agent.</p>
        <Link href="/dashboard/agents/new">
          <Button>Create Agent</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of your AI call center</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.callsThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-gray-500 mt-1">AI agents configured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(stats.avgDuration / 60)}m {stats.avgDuration % 60}s</div>
            <p className="text-xs text-gray-500 mt-1">Per call this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/agents/new">
              <Button variant="outline" className="w-full justify-start">
                Create New Agent
              </Button>
            </Link>
            <Link href="/dashboard/calls">
              <Button variant="outline" className="w-full justify-start">
                View All Calls
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full justify-start">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest calls and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

