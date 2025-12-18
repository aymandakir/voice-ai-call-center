// Database types matching Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
      }
      phone_numbers: {
        Row: {
          id: string
          organization_id: string
          number: string
          provider: string
          provider_id: string | null
          status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          number: string
          provider?: string
          provider_id?: string | null
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          number?: string
          provider?: string
          provider_id?: string | null
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          organization_id: string
          name: string
          persona: string | null
          language: string
          instructions: string
          voice_provider: string
          voice_provider_id: string | null
          phone_number_id: string | null
          model: string
          temperature: number
          first_message: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          persona?: string | null
          language?: string
          instructions: string
          voice_provider?: string
          voice_provider_id?: string | null
          phone_number_id?: string | null
          model?: string
          temperature?: number
          first_message?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          persona?: string | null
          language?: string
          instructions?: string
          voice_provider?: string
          voice_provider_id?: string | null
          phone_number_id?: string | null
          model?: string
          temperature?: number
          first_message?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          organization_id: string
          agent_id: string
          phone_number_id: string | null
          direction: 'inbound' | 'outbound'
          from_number: string
          to_number: string
          status: 'initiated' | 'ringing' | 'connected' | 'ended' | 'failed'
          started_at: string | null
          connected_at: string | null
          ended_at: string | null
          duration_seconds: number
          provider_call_id: string | null
          outcome: 'completed' | 'no_answer' | 'busy' | 'failed' | 'voicemail' | 'answered_human' | null
          summary: string | null
          transcript: string | null
          tags: string[] | null
          cost_cents: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          agent_id: string
          phone_number_id?: string | null
          direction: 'inbound' | 'outbound'
          from_number: string
          to_number: string
          status?: 'initiated' | 'ringing' | 'connected' | 'ended' | 'failed'
          started_at?: string | null
          connected_at?: string | null
          ended_at?: string | null
          duration_seconds?: number
          provider_call_id?: string | null
          outcome?: 'completed' | 'no_answer' | 'busy' | 'failed' | 'voicemail' | 'answered_human' | null
          summary?: string | null
          transcript?: string | null
          tags?: string[] | null
          cost_cents?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          agent_id?: string
          phone_number_id?: string | null
          direction?: 'inbound' | 'outbound'
          from_number?: string
          to_number?: string
          status?: 'initiated' | 'ringing' | 'connected' | 'ended' | 'failed'
          started_at?: string | null
          connected_at?: string | null
          ended_at?: string | null
          duration_seconds?: number
          provider_call_id?: string | null
          outcome?: 'completed' | 'no_answer' | 'busy' | 'failed' | 'voicemail' | 'answered_human' | null
          summary?: string | null
          transcript?: string | null
          tags?: string[] | null
          cost_cents?: number
          created_at?: string
          updated_at?: string
        }
      }
      call_events: {
        Row: {
          id: string
          call_id: string
          event_type: 'started' | 'ringing' | 'connected' | 'transcript' | 'ended' | 'error'
          data: Json
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          call_id: string
          event_type: 'started' | 'ringing' | 'connected' | 'transcript' | 'ended' | 'error'
          data: Json
          occurred_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          call_id?: string
          event_type?: 'started' | 'ringing' | 'connected' | 'transcript' | 'ended' | 'error'
          data?: Json
          occurred_at?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          organization_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
          plan_id: 'starter' | 'pro'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
          plan_id: 'starter' | 'pro'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
          plan_id?: 'starter' | 'pro'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usage_records: {
        Row: {
          id: string
          organization_id: string
          subscription_id: string | null
          call_id: string | null
          metric_type: 'calls' | 'minutes'
          quantity: number
          stripe_usage_record_id: string | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          subscription_id?: string | null
          call_id?: string | null
          metric_type: 'calls' | 'minutes'
          quantity: number
          stripe_usage_record_id?: string | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          subscription_id?: string | null
          call_id?: string | null
          metric_type?: 'calls' | 'minutes'
          quantity?: number
          stripe_usage_record_id?: string | null
          recorded_at?: string
          created_at?: string
        }
      }
    }
  }
}

