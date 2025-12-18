import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Webhook endpoint for voice provider call events
// This receives events from the voice provider (Vapi, Retell, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    console.log('Voice webhook received:', body)

    const { event, call_id, call } = body

    // Find call by provider_call_id
    let callRecord
    if (call_id || call?.id) {
      const providerCallId = call_id || call?.id
      const { data: existingCall } = await supabase
        .from('calls')
        .select('*')
        .eq('provider_call_id', providerCallId)
        .single()

      callRecord = existingCall
    }

    switch (event) {
      case 'call-started':
      case 'call.initiated': {
        if (!callRecord && call) {
          // Create new call record
          const { data: agent } = await supabase
            .from('agents')
            .select('*, organization_id')
            .eq('voice_provider_id', call.agent_id || call.assistant_id)
            .single()

          if (!agent) {
            console.error('Agent not found for call:', call.agent_id || call.assistant_id)
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
          }

          const { data: newCall, error: createError } = await supabase
            .from('calls')
            .insert({
              organization_id: agent.organization_id,
              agent_id: agent.id,
              direction: call.direction || 'inbound',
              from_number: call.from || call.from_number || '',
              to_number: call.to || call.to_number || '',
              status: 'initiated',
              provider_call_id: call.id || call_id,
              started_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating call:', createError)
            return NextResponse.json({ error: 'Failed to create call' }, { status: 500 })
          }

          // Create event
          await supabase.from('call_events').insert({
            call_id: newCall.id,
            event_type: 'started',
            data: body,
          })

          return NextResponse.json({ received: true, call_id: newCall.id })
        }
        break
      }

      case 'call-ringing':
      case 'call.ringing': {
        if (callRecord) {
          await supabase
            .from('calls')
            .update({ status: 'ringing' })
            .eq('id', callRecord.id)

          await supabase.from('call_events').insert({
            call_id: callRecord.id,
            event_type: 'ringing',
            data: body,
          })
        }
        break
      }

      case 'call-connected':
      case 'call.connected': {
        if (callRecord) {
          await supabase
            .from('calls')
            .update({
              status: 'connected',
              connected_at: new Date().toISOString(),
            })
            .eq('id', callRecord.id)

          await supabase.from('call_events').insert({
            call_id: callRecord.id,
            event_type: 'connected',
            data: body,
          })
        }
        break
      }

      case 'call-ended':
      case 'call.ended': {
        if (callRecord) {
          const duration = call?.duration || call?.duration_seconds || 0
          const endedAt = call?.ended_at ? new Date(call.ended_at).toISOString() : new Date().toISOString()

          await supabase
            .from('calls')
            .update({
              status: 'ended',
              ended_at: endedAt,
              duration_seconds: duration,
              outcome: call?.outcome || call?.status || 'completed',
            })
            .eq('id', callRecord.id)

          await supabase.from('call_events').insert({
            call_id: callRecord.id,
            event_type: 'ended',
            data: body,
          })

          // Record usage
          if (callRecord.organization_id) {
            const minutes = Math.ceil(duration / 60)
            await supabase.from('usage_records').insert({
              organization_id: callRecord.organization_id,
              call_id: callRecord.id,
              metric_type: 'minutes',
              quantity: minutes,
            })
            await supabase.from('usage_records').insert({
              organization_id: callRecord.organization_id,
              call_id: callRecord.id,
              metric_type: 'calls',
              quantity: 1,
            })
          }
        }
        break
      }

      case 'transcript':
      case 'call.transcript': {
        if (callRecord && call?.transcript) {
          await supabase
            .from('calls')
            .update({ transcript: call.transcript })
            .eq('id', callRecord.id)

          await supabase.from('call_events').insert({
            call_id: callRecord.id,
            event_type: 'transcript',
            data: { transcript: call.transcript },
          })
        }
        break
      }

      case 'call-summary':
      case 'call.summary': {
        if (callRecord && call?.summary) {
          await supabase
            .from('calls')
            .update({ summary: call.summary })
            .eq('id', callRecord.id)
        }
        break
      }

      default:
        console.log('Unhandled event type:', event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

