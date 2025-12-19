// Zod schemas for validation
import { z } from 'zod'

// Organization schemas
export const organizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
})

export const createOrganizationSchema = organizationSchema

export const updateOrganizationSchema = organizationSchema.partial()

// Agent schemas
export const agentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  persona: z.string().max(500).optional().nullable(),
  language: z.string().default('en'),
  instructions: z.string().min(10, 'Instructions must be at least 10 characters').max(5000),
  model: z.string().default('gpt-4'),
  temperature: z.number().min(0).max(2).default(0.7),
  first_message: z.string().max(500).optional().nullable(),
  phone_number_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
})

export const createAgentSchema = agentSchema

export const updateAgentSchema = agentSchema.partial()

// Phone number schemas
export const phoneNumberSchema = z.object({
  number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  provider: z.string().default('mock'),
})

export const createPhoneNumberSchema = phoneNumberSchema

// Call schemas
export const callFilterSchema = z.object({
  agent_id: z.string().uuid().optional(),
  direction: z.enum(['inbound', 'outbound']).optional(),
  status: z.enum(['initiated', 'ringing', 'connected', 'ended', 'failed']).optional(),
  outcome: z.enum(['completed', 'no_answer', 'busy', 'failed', 'voicemail', 'answered_human']).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
})

export const createCallSchema = z.object({
  agent_id: z.string().uuid(),
  phone_number_id: z.string().uuid().optional().nullable(),
  direction: z.enum(['inbound', 'outbound']),
  from_number: z.string(),
  to_number: z.string(),
})

export const updateCallSchema = z.object({
  status: z.enum(['initiated', 'ringing', 'connected', 'ended', 'failed']).optional(),
  outcome: z.enum(['completed', 'no_answer', 'busy', 'failed', 'voicemail', 'answered_human']).optional().nullable(),
  summary: z.string().optional().nullable(),
  transcript: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  duration_seconds: z.number().optional(),
  cost_cents: z.number().optional(),
})

// Call event schemas
export const callEventSchema = z.object({
  call_id: z.string().uuid(),
  event_type: z.enum(['started', 'ringing', 'connected', 'transcript', 'ended', 'error'] as const),
  data: z.record(z.string(), z.any()),
})

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required').max(100),
  organization_name: z.string().min(1, 'Organization name is required').max(100),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Profile schemas
export const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional().nullable(),
})

// Type exports
export type OrganizationInput = z.infer<typeof organizationSchema>
export type CreateAgentInput = z.infer<typeof createAgentSchema>
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>
export type CreatePhoneNumberInput = z.infer<typeof createPhoneNumberSchema>
export type CallFilterInput = z.infer<typeof callFilterSchema>
export type CreateCallInput = z.infer<typeof createCallSchema>
export type UpdateCallInput = z.infer<typeof updateCallSchema>
export type CallEventInput = z.infer<typeof callEventSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

