'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createAgentSchema, type CreateAgentInput } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewAgentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateAgentInput>({
    name: '',
    persona: '',
    language: 'en',
    instructions: '',
    model: 'gpt-4',
    temperature: 0.7,
    first_message: '',
    is_active: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const validated = createAgentSchema.parse(formData)
      const supabase = createClient()

      // Get user's organization
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: membershipData } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

      if (!membershipData || typeof membershipData !== 'object' || !('organization_id' in membershipData)) {
        throw new Error('No organization found')
      }
      const membership = membershipData as { organization_id: string }

      // Create agent
      const agentInsert: any = {
        organization_id: membership.organization_id,
        ...validated,
      }
      const { data: agent, error: agentError } = await (supabase.from('agents') as any)
        .insert(agentInsert)
        .select()
        .single()

      if (agentError) throw agentError

      // Sync to voice provider (mock for now)
      // In production, this would call the actual provider API
      console.log('Agent created:', agent.id)

      router.push('/dashboard/agents')
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create agent')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/dashboard/agents" className="text-sm text-gray-600 hover:underline dark:text-gray-400">
          ← Back to Agents
        </Link>
        <h1 className="text-3xl font-bold mt-2">Create New Agent</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Configure your AI voice agent</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
          <CardDescription>Define your agent's personality and behavior</CardDescription>
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Customer Support Agent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona">Persona / Role</Label>
              <Input
                id="persona"
                value={formData.persona || ''}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                placeholder="Friendly customer support representative"
              />
              <p className="text-xs text-gray-500">Brief description of the agent's role</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions *</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="You are a helpful customer support agent. Always be polite and professional..."
                rows={8}
                required
              />
              <p className="text-xs text-gray-500">System prompt that defines how the agent behaves</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="en"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="gpt-4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature: {formData.temperature}</Label>
              <input
                type="range"
                id="temperature"
                min="0"
                max="2"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Controls randomness (0 = deterministic, 2 = very creative)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_message">First Message</Label>
              <Input
                id="first_message"
                value={formData.first_message || ''}
                onChange={(e) => setFormData({ ...formData, first_message: e.target.value })}
                placeholder="Hello! How can I help you today?"
              />
              <p className="text-xs text-gray-500">Initial greeting when call connects</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (agent will receive calls)
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Agent'}
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

