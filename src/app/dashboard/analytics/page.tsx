import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'

async function getAnalytics() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) return null

  const orgIds = memberships.map((m) => m.organization_id)

  // Get calls from last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: calls } = await supabase
    .from('calls')
    .select('*')
    .in('organization_id', orgIds)
    .gte('created_at', thirtyDaysAgo.toISOString())

  if (!calls) return null

  // Group by date
  const callsByDate: Record<string, number> = {}
  calls.forEach((call) => {
    const date = format(new Date(call.created_at), 'MMM d')
    callsByDate[date] = (callsByDate[date] || 0) + 1
  })

  const chartData = Object.entries(callsByDate)
    .map(([date, count]) => ({ date, calls: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Outcome distribution
  const outcomes: Record<string, number> = {}
  calls.forEach((call) => {
    const outcome = call.outcome || 'unknown'
    outcomes[outcome] = (outcomes[outcome] || 0) + 1
  })

  const outcomeData = Object.entries(outcomes).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
  }))

  // Agent performance
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name')
    .in('organization_id', orgIds)

  const agentStats: Record<string, { name: string; calls: number; totalDuration: number }> = {}
  calls.forEach((call) => {
    if (!agentStats[call.agent_id]) {
      const agent = agents?.find((a) => a.id === call.agent_id)
      agentStats[call.agent_id] = {
        name: agent?.name || 'Unknown',
        calls: 0,
        totalDuration: 0,
      }
    }
    agentStats[call.agent_id].calls++
    agentStats[call.agent_id].totalDuration += call.duration_seconds || 0
  })

  const agentData = Object.values(agentStats).map((stat) => ({
    name: stat.name,
    calls: stat.calls,
    avgDuration: Math.round(stat.totalDuration / stat.calls),
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

  return {
    chartData,
    outcomeData,
    agentData,
    totalCalls: calls.length,
    totalDuration: calls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0),
    avgDuration: Math.round(calls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0) / calls.length),
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No analytics data available</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Call center performance metrics</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalCalls}</div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.floor(analytics.totalDuration / 60)}m</div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avg Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.floor(analytics.avgDuration / 60)}m {analytics.avgDuration % 60}s
            </div>
            <p className="text-sm text-gray-500 mt-1">Per call</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
            <CardDescription>Calls per day (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcome Distribution</CardTitle>
            <CardDescription>Call outcomes breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.outcomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Call volume and average duration by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.agentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="calls" fill="#0088FE" name="Calls" />
                <Bar yAxisId="right" dataKey="avgDuration" fill="#00C49F" name="Avg Duration (s)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

