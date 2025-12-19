export const ORG_ID = process.env.SUPABASE_ORG_ID || 'voice-demo'

export const withOrgFilter = (query: any) => {
  return query.eq('organization_id', ORG_ID)
}

