import { PLANS } from '../types/entities'

export async function createStripeProducts() {
  const stripe = (await import('./client')).stripe

  const products = []
  for (const plan of Object.values(PLANS)) {
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
    })

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.priceMonthly,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    })

    products.push({ product, price, plan })
  }

  return products
}

export function getStripePriceId(planId: string): string {
  // In production, these would be stored in environment variables or database
  // For now, return mock IDs
  const priceIds: Record<string, string> = {
    starter: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
  }
  return priceIds[planId] || priceIds.starter
}

