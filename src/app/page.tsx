import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { UseCases } from '@/components/landing/use-cases'
import { CTA } from '@/components/landing/cta'

export const metadata = {
  title: 'AI Voice Call Center | Build Intelligent Voice AI Agents',
  description:
    'Build intelligent voice AI agents that handle customer calls 24/7. Perfect for support, sales, and appointment reminders.',
  openGraph: {
    title: 'AI Voice Call Center',
    description: 'Build intelligent voice AI agents that handle customer calls 24/7',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <Hero />
      <Features />
      <UseCases />
      <CTA />
    </main>
  )
}
