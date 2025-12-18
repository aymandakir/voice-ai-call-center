'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function SubscribeButton({ planId, hasSubscription }: { planId: string; hasSubscription: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create checkout session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSubscribe} className="w-full" disabled={loading}>
      {loading ? 'Loading...' : hasSubscription ? 'Switch Plan' : 'Subscribe'}
    </Button>
  )
}

