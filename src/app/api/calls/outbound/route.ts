import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getVoiceProvider } from '@/lib/voice/provider'
import type { Agent, PhoneNumber, Call } from '@/lib/types/entities'

// API route to initiate outbound calls
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { agent_id, to_number, from_number } = await request.json()

    if (!agent_id || !to_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get agent and verify access
    const { data: agentData, error: agentError } = await (supabase.from('agents') as any)
      .select('id, organization_id, voice_provider_id, phone_numbers(*)')
      .eq('id', agent_id)
      .single()

    if (agentError || !agentData) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Extract values to avoid TypeScript inference issues
    const agentId = (agentData as any).id as string
    const organizationId = (agentData as any).organization_id as string
    const voiceProviderId = (agentData as any).voice_provider_id as string | null
    const phoneNumbers = (agentData as any).phone_numbers as PhoneNumber[] | null

    // Verify user has access to organization
    const { data: membership } = await (supabase.from('organization_members') as any)
      .select('*')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get phone number
    const phoneNumber = Array.isArray(phoneNumbers) && phoneNumbers.length > 0
      ? phoneNumbers[0]
      : null

    const fromNum = from_number || phoneNumber?.number || ''

    if (!fromNum) {
      return NextResponse.json({ error: 'No phone number configured for agent' }, { status: 400 })
    }

    // Create call record
    const callInsert = {
      organization_id: organizationId,
      agent_id: agentId,
      phone_number_id: phoneNumber?.id || null,
      direction: 'outbound' as const,
      from_number: fromNum,
      to_number: to_number,
      status: 'initiated' as const,
    }
    // @ts-ignore - Supabase type inference issue with Database types
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert(callInsert as any)
      .select()
      .single()

    if (callError || !callData) {
      console.error('Error creating call:', callError)
      return NextResponse.json({ error: 'Failed to create call' }, { status: 500 })
    }

    const call = callData as Call

    // Start call via voice provider
    const provider = getVoiceProvider()
    const webhookUrl = `${request.nextUrl.origin}/api/webhooks/voice`

    try {
      const providerResponse = await provider.startOutboundCall({
        agentId: voiceProviderId || agentId,
        fromNumber: fromNum,
        toNumber: to_number,
        webhookUrl,
      })

      // Update call with provider call ID
      await (supabase.from('calls') as any)
        .update({ provider_call_id: providerResponse.providerCallId })
        .eq('id', call.id)

      return NextResponse.json({
        call_id: call.id,
        provider_call_id: providerResponse.providerCallId,
        status: providerResponse.status,
      })
    } catch (providerError) {
      console.error('Provider error:', providerError)
      // Update call status to failed
      await (supabase.from('calls') as any)
        .update({ status: 'failed' })
        .eq('id', call.id)

      return NextResponse.json({ error: 'Failed to start call' }, { status: 500 })
    }
  } catch (error) {
    console.error('Outbound call error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

