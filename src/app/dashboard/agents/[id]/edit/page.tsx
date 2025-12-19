'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { updateAgentSchema, type UpdateAgentInput } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Agent } from '@/lib/types/entities'
import { ORG_ID } from '@/lib/org-context'

export default function EditAgentPage() {
  const router = useRouter()
  const params = useParams()
  const agentId = params.id as string

  const [agent, setAgent] = useState<Agent | null>(null)
  const [formData, setFormData] = useState<UpdateAgentInput>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchAgent() {
      const supabase = createClient()
      const { data, error: fetchError } = await (supabase.from('agents') as any)
        .select('*')
        .eq('id', agentId)
        .eq('organization_id', ORG_ID)
        .single()

      if (fetchError || !data) {
        setError('Agent not found')
        return
      }

      const agentData = data as Agent
      setAgent(agentData)
      setFormData({
        name: agentData.name,
        persona: agentData.persona || '',
        language: agentData.language,
        instructions: agentData.instructions,
        model: agentData.model,
        temperature: agentData.temperature,
        first_message: agentData.first_message || '',
        is_active: agentData.is_active,
      })
      setFetching(false)
    }

    if (agentId) {
      fetchAgent()
    }
  }, [agentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const validated = updateAgentSchema.parse(formData)
      const supabase = createClient()

      const { error: updateError } = await (supabase.from('agents') as any)
        .update(validated)
        .eq('id', agentId)
        .eq('organization_id', ORG_ID)

      if (updateError) throw updateError

      router.push('/dashboard/agents')
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update agent')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>Loading...</p>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Agent not found</p>
        <Link href="/dashboard/agents">
          <Button>Back to Agents</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/dashboard/agents" className="text-sm text-gray-600 hover:underline dark:text-gray-400">
          ← Back to Agents
        </Link>
        <h1 className="text-3xl font-bold mt-2">Edit Agent</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Update agent configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
          <CardDescription>Update your agent's personality and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                value={formData.name || agent.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona">Persona / Role</Label>
              <Input
                id="persona"
                value={formData.persona ?? agent.persona ?? ''}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions *</Label>
              <Textarea
                id="instructions"
                value={formData.instructions || agent.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={8}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language || agent.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model || agent.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {formData.temperature ?? agent.temperature}</Label>
              <input
                type="range"
                id="temperature"
                min="0"
                max="2"
                step="0.1"
                value={formData.temperature ?? agent.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_message">First Message</Label>
              <Input
                id="first_message"
                value={formData.first_message ?? agent.first_message ?? ''}
                onChange={(e) => setFormData({ ...formData, first_message: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active ?? agent.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Agent'}
              </Button>
              <Link href="/dashboard/agents">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

