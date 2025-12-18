// Entity types with relations
import type { Database } from './database'

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type Organization = Tables<'organizations'>
export type Profile = Tables<'profiles'>
export type OrganizationMember = Tables<'organization_members'>
export type PhoneNumber = Tables<'phone_numbers'>
export type Agent = Tables<'agents'>
export type Call = Tables<'calls'>
export type CallEvent = Tables<'call_events'>
export type Subscription = Tables<'subscriptions'>
export type UsageRecord = Tables<'usage_records'>

// Extended types with relations
export interface OrganizationWithMembers extends Organization {
  members?: (OrganizationMember & { profile?: Profile })[]
}

export interface AgentWithPhoneNumber extends Agent {
  phone_number?: PhoneNumber | null
}

export interface CallWithRelations extends Call {
  agent?: Agent
  phone_number?: PhoneNumber | null
  events?: CallEvent[]
}

export interface SubscriptionWithUsage extends Subscription {
  usage_records?: UsageRecord[]
}

// Plan types
export type PlanId = 'starter' | 'pro'

export interface Plan {
  id: PlanId
  name: string
  description: string
  priceMonthly: number // in cents
  priceYearly?: number // in cents
  limits: {
    monthlyCalls?: number
    monthlyMinutes?: number
    agents?: number
    phoneNumbers?: number
  }
  features: string[]
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    priceMonthly: 2900, // $29/month
    limits: {
      monthlyCalls: 500,
      monthlyMinutes: 1000,
      agents: 3,
      phoneNumbers: 1,
    },
    features: [
      '500 calls/month',
      '1,000 minutes/month',
      'Up to 3 AI agents',
      '1 phone number',
      'Call logs & transcripts',
      'Basic analytics',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses',
    priceMonthly: 9900, // $99/month
    limits: {
      monthlyCalls: 5000,
      monthlyMinutes: 10000,
      agents: 20,
      phoneNumbers: 5,
    },
    features: [
      '5,000 calls/month',
      '10,000 minutes/month',
      'Up to 20 AI agents',
      '5 phone numbers',
      'Advanced analytics',
      'Custom integrations',
      'Priority support',
    ],
  },
}

