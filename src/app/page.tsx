import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Users, BarChart3, Zap, Shield, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              AI Voice Call Center
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Build intelligent voice AI agents that handle customer calls 24/7. Perfect for support, sales, and
              appointment reminders.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Powerful features to build and manage your AI call center
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>AI Voice Agents</CardTitle>
                <CardDescription>
                  Create intelligent agents with custom personalities, instructions, and voice settings
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Call Management</CardTitle>
                <CardDescription>
                  Handle inbound and outbound calls with real-time call logs, transcripts, and analytics
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Track call volume, duration, outcomes, and agent performance with detailed dashboards
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Easy Integration</CardTitle>
                <CardDescription>
                  Connect phone numbers, configure agents, and start receiving calls in minutes
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with multi-tenant isolation and row-level access control
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Multi-Language</CardTitle>
                <CardDescription>
                  Support customers in multiple languages with configurable language settings per agent
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Use Cases</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Perfect for a variety of business needs
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Support</CardTitle>
                <CardDescription>
                  Provide 24/7 customer support with AI agents that can answer questions, handle complaints, and
                  escalate when needed.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Outbound Sales</CardTitle>
                <CardDescription>
                  Automate sales calls, follow-ups, and lead qualification with intelligent AI agents that sound
                  natural and professional.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Appointment Reminders</CardTitle>
                <CardDescription>
                  Automatically call customers to confirm appointments, send reminders, and handle rescheduling
                  requests.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Create your first AI voice agent in minutes. No credit card required.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
