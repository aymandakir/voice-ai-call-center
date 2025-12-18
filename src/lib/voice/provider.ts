// Voice provider factory and abstraction
import { MockVoiceProvider } from './mock-provider'
import type { VoiceProvider, VoiceProviderConfig } from './types'

let providerInstance: VoiceProvider | null = null

export function getVoiceProvider(): VoiceProvider {
  if (providerInstance) {
    return providerInstance
  }

  const providerType = process.env.VOICE_PROVIDER || 'mock'
  const config: VoiceProviderConfig = {
    apiKey: process.env.VOICE_PROVIDER_API_KEY || 'mock_key',
    baseUrl: process.env.VOICE_PROVIDER_BASE_URL,
  }

  switch (providerType) {
    case 'mock':
      providerInstance = new MockVoiceProvider(config)
      break
    // Future providers can be added here:
    // case 'vapi':
    //   providerInstance = new VapiProvider(config)
    //   break
    // case 'retell':
    //   providerInstance = new RetellProvider(config)
    //   break
    default:
      providerInstance = new MockVoiceProvider(config)
  }

  return providerInstance
}

// Helper to create agent in provider system
export async function syncAgentToProvider(agentId: string, config: {
  name: string
  instructions: string
  model?: string
  temperature?: number
  firstMessage?: string
  language?: string
}) {
  const provider = getVoiceProvider()
  return provider.createAgent({
    id: agentId,
    ...config,
  })
}

// Helper to update agent in provider system
export async function updateAgentInProvider(providerAgentId: string, config: Partial<{
  name: string
  instructions: string
  model?: string
  temperature?: number
  firstMessage?: string
  language?: string
}>) {
  const provider = getVoiceProvider()
  return provider.updateAgent(providerAgentId, config)
}

