'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fadeInUp } from '@/lib/animations'

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const title = 'AI Voice Call Center'
  const letters = title.split('')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-black dark:to-gray-900">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(0, 122, 255, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        <div className="mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl text-center">
          {/* Main Title with letter stagger */}
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-light tracking-tight mb-6 sm:mb-8 lg:mb-12">
            <span className="inline-block">
              {mounted &&
                letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="inline-block"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-light text-gray-400 dark:text-gray-500 mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-0"
            style={{ letterSpacing: '-0.01em' }}
          >
            Build intelligent voice AI agents that handle customer calls 24/7.
          </motion.p>

          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 mb-8 sm:mb-10 lg:mb-12 mx-4 sm:mx-0"
          >
            <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-medium text-gray-300 dark:text-gray-400">
              Perfect for support, sales, and appointment reminders
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-0 w-full sm:w-auto"
          >
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Link href="/signup" className="block w-full sm:w-auto">
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-[#007AFF] hover:bg-[#0051D5] text-white w-full sm:w-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium rounded-xl lg:rounded-2xl shadow-lg shadow-blue-500/20 group transition-all duration-200 hover:rounded-2xl"
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Link href="/login" className="block w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 xl:px-12 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium rounded-xl lg:rounded-2xl border-2 border-white/20 dark:border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-xl hover:bg-white/10 dark:hover:bg-white/10 text-white transition-all duration-200 hover:rounded-2xl"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div
        className="hidden sm:block absolute bottom-8 lg:bottom-12 xl:bottom-16 left-1/2 -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-px h-12 lg:h-16 bg-white/30 dark:bg-white/20" />
      </motion.div>
    </section>
  )
}
