import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { getStripePriceId } from '@/lib/stripe/plans'

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

    // Get user's organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    // Create or get Stripe customer
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    let customerId: string

    // Check if organization already has a customer
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', membership.organization_id)
      .single()

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email || profile?.email || undefined,
        metadata: {
          organization_id: membership.organization_id,
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
        organization_id: membership.organization_id,
        plan_id: planId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}

