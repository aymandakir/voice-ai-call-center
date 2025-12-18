import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PLANS } from '@/lib/types/entities'
import { formatCurrency } from '@/lib/utils'
import { Check } from 'lucide-react'
import { SubscribeButton } from './subscribe-button'

async function getSubscription() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single()

  if (!membership) return null

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('organization_id', membership.organization_id)
    .eq('status', 'active')
    .single()

  return subscription
}

export default async function SettingsPage({ searchParams }: { searchParams: { success?: string; canceled?: string } }) {
  const subscription = await getSubscription()

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your subscription and billing</p>
      </div>

      {searchParams.success && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-200">
          Subscription activated successfully!
        </div>
      )}

      {searchParams.canceled && (
        <div className="mb-6 rounded-md bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
          Subscription checkout was canceled.
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div>
              <p className="text-lg font-semibold capitalize">{subscription.plan_id}</p>
              <p className="text-sm text-gray-500 mt-1">
                {subscription.current_period_end
                  ? `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : 'Active'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-400">No active subscription</p>
              <p className="text-sm text-gray-500 mt-1">Choose a plan below to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.values(PLANS).map((plan) => (
            <Card key={plan.id} className={subscription?.plan_id === plan.id ? 'border-blue-500' : ''}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{formatCurrency(plan.priceMonthly)}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {subscription?.plan_id === plan.id ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <SubscribeButton planId={plan.id} hasSubscription={!!subscription} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

