'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Users, BarChart3, Zap, Shield, Globe } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/animations'

const features = [
  {
    icon: Phone,
    title: 'AI Voice Agents',
    description: 'Create intelligent agents with custom personalities, instructions, and voice settings',
    color: '#007AFF',
  },
  {
    icon: Users,
    title: 'Call Management',
    description: 'Handle inbound and outbound calls with real-time call logs, transcripts, and analytics',
    color: '#34C759',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Track call volume, duration, outcomes, and agent performance with detailed dashboards',
    color: '#AF52DE',
  },
  {
    icon: Zap,
    title: 'Easy Integration',
    description: 'Connect phone numbers, configure agents, and start receiving calls in minutes',
    color: '#FF9500',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with multi-tenant isolation and row-level access control',
    color: '#FF3B30',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Support customers in multiple languages with configurable language settings per agent',
    color: '#5856D6',
  },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-16 sm:py-24 md:py-32 lg:py-40 xl:py-48 2xl:py-56 bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl text-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24"
        >
          <motion.h2
            variants={staggerItem}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light tracking-tight mb-4 sm:mb-6 lg:mb-8"
            style={{ letterSpacing: '-0.02em' }}
          >
            Everything you need
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 dark:text-gray-400 font-light px-4 sm:px-0"
            style={{ letterSpacing: '-0.01em' }}
          >
            Powerful features to build and manage your AI call center
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-7xl xl:max-w-8xl 2xl:max-w-[1400px] mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="group"
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  initial={{ scale: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative p-6 sm:p-7 lg:p-8 xl:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/50 to-white/10 dark:from-white/5 dark:to-white/0 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 h-full cursor-pointer"
                >
                  <motion.div
                    className="mb-4 sm:mb-5 lg:mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14" style={{ color: feature.color }} />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-3xl font-semibold mb-3 sm:mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base lg:text-lg xl:text-xl">
                    {feature.description}
                  </p>
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at center, ${feature.color}10, transparent 70%)`,
                    }}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

