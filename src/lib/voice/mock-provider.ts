// Mock voice provider for development/testing
import type {
  VoiceProvider,
  VoiceProviderConfig,
  AgentConfig,
  InboundCallParams,
  OutboundCallParams,
  CallResponse,
  CallStatus,
} from './types'

export class MockVoiceProvider implements VoiceProvider {
  private config: VoiceProviderConfig
  private agents: Map<string, AgentConfig & { providerId: string }> = new Map()
  private calls: Map<string, CallStatus & { providerCallId: string }> = new Map()

  constructor(config: VoiceProviderConfig) {
    this.config = config
  }

  async createAgent(config: AgentConfig): Promise<{ agentId: string }> {
    const providerId = `mock_agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.agents.set(config.id, { ...config, providerId })
    console.log('[MockProvider] Created agent:', providerId, config.name)
    return { agentId: providerId }
  }

  async updateAgent(agentId: string, config: Partial<AgentConfig>): Promise<void> {
    const existing = this.agents.get(agentId)
    if (!existing) throw new Error(`Agent ${agentId} not found`)
    this.agents.set(agentId, { ...existing, ...config })
    console.log('[MockProvider] Updated agent:', agentId)
  }

  async deleteAgent(agentId: string): Promise<void> {
    this.agents.delete(agentId)
    console.log('[MockProvider] Deleted agent:', agentId)
  }

  async startInboundCall(params: InboundCallParams): Promise<CallResponse> {
    const providerCallId = `mock_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const callId = providerCallId

    // Simulate call progression
    this.calls.set(callId, {
      callId,
      status: 'initiated',
      providerCallId,
    })

    // Simulate async call progression (in real implementation, this would be via webhooks)
    setTimeout(() => {
      const call = this.calls.get(callId)
      if (call) {
        call.status = 'ringing'
      }
    }, 1000)

    setTimeout(() => {
      const call = this.calls.get(callId)
      if (call) {
        call.status = 'connected'
      }
    }, 2000)

    console.log('[MockProvider] Started inbound call:', providerCallId, params)
    return {
      callId,
      status: 'initiated',
      providerCallId,
    }
  }

  async startOutboundCall(params: OutboundCallParams): Promise<CallResponse> {
    const providerCallId = `mock_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const callId = providerCallId

    this.calls.set(callId, {
      callId,
      status: 'initiated',
      providerCallId,
    })

    setTimeout(() => {
      const call = this.calls.get(callId)
      if (call) {
        call.status = 'ringing'
      }
    }, 1000)

    setTimeout(() => {
      const call = this.calls.get(callId)
      if (call) {
        call.status = 'connected'
      }
    }, 2000)

    console.log('[MockProvider] Started outbound call:', providerCallId, params)
    return {
      callId,
      status: 'initiated',
      providerCallId,
    }
  }

  async endCall(callId: string): Promise<void> {
    const call = this.calls.get(callId)
    if (call) {
      call.status = 'ended'
      call.duration = Math.floor(Math.random() * 300) + 30 // 30-330 seconds
    }
    console.log('[MockProvider] Ended call:', callId)
  }

  async getCallStatus(callId: string): Promise<CallStatus> {
    const call = this.calls.get(callId)
    if (!call) {
      throw new Error(`Call ${callId} not found`)
    }
    return call
  }

  async purchaseNumber(areaCode?: string): Promise<{ number: string; providerId: string }> {
    // Generate a mock phone number
    const area = areaCode || '555'
    const exchange = Math.floor(Math.random() * 800) + 200
    const number = Math.floor(Math.random() * 10000)
    const phoneNumber = `+1${area}${exchange}${number.toString().padStart(4, '0')}`
    const providerId = `mock_number_${Date.now()}`

    console.log('[MockProvider] Purchased number:', phoneNumber)
    return { number: phoneNumber, providerId }
  }

  async releaseNumber(providerId: string): Promise<void> {
    console.log('[MockProvider] Released number:', providerId)
  }
}

