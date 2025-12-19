'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fadeInUp } from '@/lib/animations'

export function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-16 sm:py-24 md:py-32 lg:py-40 xl:py-48 2xl:py-56 bg-white dark:bg-black relative overflow-hidden">
      {/* Gradient bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007AFF] via-[#34C759] to-[#007AFF]"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <motion.div
          ref={ref}
          variants={fadeInUp}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl text-center"
        >
          <motion.h2
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-light tracking-tight mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-0"
            style={{ letterSpacing: '-0.02em' }}
          >
            Ready to get started?
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 dark:text-gray-400 font-light mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0"
            style={{ letterSpacing: '-0.01em' }}
          >
            Create your first AI voice agent in minutes. No credit card required.
          </motion.p>

          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="px-4 sm:px-0"
          >
            <Link href="/signup" className="inline-block w-full sm:w-auto">
              <Button
                size="lg"
                className="relative overflow-hidden bg-[#34C759] hover:bg-[#30D158] text-white w-full sm:w-auto px-8 sm:px-10 lg:px-12 xl:px-16 py-5 sm:py-6 lg:py-8 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium rounded-xl sm:rounded-2xl shadow-2xl shadow-green-500/30 group transition-all duration-200"
              >
                <motion.span
                  className="relative z-10"
                  animate={{
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 20px rgba(255,255,255,0.5)',
                      '0 0 0px rgba(255,255,255,0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  Start Free Trial
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

