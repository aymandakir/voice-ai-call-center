// Voice provider abstraction types

export interface VoiceProviderConfig {
  apiKey: string
  baseUrl?: string
}

export interface AgentConfig {
  id: string
  name: string
  instructions: string
  model?: string
  temperature?: number
  firstMessage?: string
  language?: string
  voice?: string
}

export interface InboundCallParams {
  agentId: string
  fromNumber: string
  toNumber: string
  webhookUrl?: string
}

export interface OutboundCallParams {
  agentId: string
  fromNumber: string
  toNumber: string
  webhookUrl?: string
}

export interface CallResponse {
  callId: string
  status: 'initiated' | 'ringing' | 'connected' | 'failed'
  providerCallId?: string
}

export interface CallStatus {
  callId: string
  status: 'initiated' | 'ringing' | 'connected' | 'ended' | 'failed'
  duration?: number
  transcript?: string
  summary?: string
}

export interface VoiceProvider {
  // Create/update agent in provider system
  createAgent(config: AgentConfig): Promise<{ agentId: string }>
  updateAgent(agentId: string, config: Partial<AgentConfig>): Promise<void>
  deleteAgent(agentId: string): Promise<void>

  // Call management
  startInboundCall(params: InboundCallParams): Promise<CallResponse>
  startOutboundCall(params: OutboundCallParams): Promise<CallResponse>
  endCall(callId: string): Promise<void>
  getCallStatus(callId: string): Promise<CallStatus>

  // Phone number management
  purchaseNumber(areaCode?: string): Promise<{ number: string; providerId: string }>
  releaseNumber(providerId: string): Promise<void>
}

