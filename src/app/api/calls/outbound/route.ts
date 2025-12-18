import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getVoiceProvider } from '@/lib/voice/provider'

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
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*, organization_id, phone_numbers(*)')
      .eq('id', agent_id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Verify user has access to organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', agent.organization_id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get phone number
    const phoneNumber = Array.isArray(agent.phone_numbers) && agent.phone_numbers.length > 0
      ? agent.phone_numbers[0]
      : null

    const fromNum = from_number || phoneNumber?.number || ''

    if (!fromNum) {
      return NextResponse.json({ error: 'No phone number configured for agent' }, { status: 400 })
    }

    // Create call record
    const { data: call, error: callError } = await supabase
      .from('calls')
      .insert({
        organization_id: agent.organization_id,
        agent_id: agent.id,
        phone_number_id: phoneNumber?.id || null,
        direction: 'outbound',
        from_number: fromNum,
        to_number: to_number,
        status: 'initiated',
      })
      .select()
      .single()

    if (callError) {
      console.error('Error creating call:', callError)
      return NextResponse.json({ error: 'Failed to create call' }, { status: 500 })
    }

    // Start call via voice provider
    const provider = getVoiceProvider()
    const webhookUrl = `${request.nextUrl.origin}/api/webhooks/voice`

    try {
      const providerResponse = await provider.startOutboundCall({
        agentId: agent.voice_provider_id || agent.id,
        fromNumber: fromNum,
        toNumber: to_number,
        webhookUrl,
      })

      // Update call with provider call ID
      await supabase
        .from('calls')
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
      await supabase
        .from('calls')
        .update({ status: 'failed' })
        .eq('id', call.id)

      return NextResponse.json({ error: 'Failed to start call' }, { status: 500 })
    }
  } catch (error) {
    console.error('Outbound call error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

