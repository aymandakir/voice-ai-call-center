import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { getStripePriceId } from '@/lib/stripe/plans'
import { ORG_ID } from '@/lib/org-context'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()

    if (!planId || (planId !== 'starter' && planId !== 'pro')) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create or get Stripe customer
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    let customerId: string

    // Check if organization already has a customer - filter by ORG_ID
    const { data: existingSubscription } = await (supabase.from('subscriptions') as any)
      .select('stripe_customer_id')
      .eq('organization_id', ORG_ID)
      .single()

    if (existingSubscription && typeof existingSubscription === 'object' && 'stripe_customer_id' in existingSubscription) {
      customerId = (existingSubscription as { stripe_customer_id: string }).stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email || (profile && typeof profile === 'object' && 'email' in profile ? (profile as { email: string | null }).email : null) || undefined,
        metadata: {
          organization_id: ORG_ID,
          user_id: user.id,
        },
      })
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: getStripePriceId(planId),
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard/settings?success=true`,
      cancel_url: `${request.nextUrl.origin}/dashboard/settings?canceled=true`,
      metadata: {
        organization_id: ORG_ID,
        plan_id: planId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}

