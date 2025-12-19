import { createClient } from './server'
import type { Profile, Organization, OrganizationMember } from '../types/entities'

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile ? { ...user, profile } : user
}

export async function getUserOrganizations(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('organization_members')
    .select('*, organization:organizations(*)')
    .eq('user_id', userId)

  if (error) throw error
  return data as (OrganizationMember & { organization: Organization })[]
}

export async function getCurrentOrganization(organizationId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Verify user is a member of this organization
  const { data: member } = await (supabase.from('organization_members') as any)
    .select('*, organization:organizations(*)')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single()

  if (!member) return null

  return (member as any).organization as Organization
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireOrganization(organizationId: string) {
  const organization = await getCurrentOrganization(organizationId)
  if (!organization) {
    throw new Error('Organization not found or access denied')
  }
  return organization
}

