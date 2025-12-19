'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/animations'

const useCases = [
  {
    title: 'Customer Support',
    description:
      'Provide 24/7 customer support with AI agents that can answer questions, handle complaints, and escalate when needed.',
    stats: { label: 'Availability', value: '24/7' },
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Outbound Sales',
    description:
      'Automate sales calls, follow-ups, and lead qualification with intelligent AI agents that sound natural and professional.',
    stats: { label: 'Cost Reduction', value: '90%' },
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    title: 'Appointment Reminders',
    description:
      'Automatically call customers to confirm appointments, send reminders, and handle rescheduling requests.',
    stats: { label: 'Efficiency', value: '5x faster' },
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
]

export function UseCases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-16 sm:py-24 md:py-32 lg:py-40 xl:py-48 2xl:py-56 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
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
            Use Cases
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 dark:text-gray-400 font-light px-4 sm:px-0"
            style={{ letterSpacing: '-0.01em' }}
          >
            Perfect for a variety of business needs
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-7xl xl:max-w-8xl 2xl:max-w-[1400px] mx-auto"
        >
          {useCases.map((useCase, index) => (
            <motion.div key={useCase.title} variants={staggerItem} className="group">
              <motion.div
                initial={{ scale: 1, y: 0, rotateZ: 0 }}
                whileHover={{ scale: 1.02, y: -8, rotateZ: 2 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`relative p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${useCase.gradient} backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 h-full cursor-pointer overflow-hidden`}
              >
                <motion.div
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-200 dark:text-gray-800"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1, rotate: 5 }}
                  transition={{ delay: 0.1 }}
                >
                  {useCase.stats.value}
                </motion.div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-3 sm:mb-4 tracking-tight">{useCase.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6">
                  {useCase.description}
                </p>
                <motion.div
                  className="flex items-center gap-2 text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span>{useCase.stats.label}:</span>
                  <span className="text-[#007AFF]">{useCase.stats.value}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

