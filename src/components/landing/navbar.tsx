'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50)
  })

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between">
          <Link
            href="/"
            className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold tracking-tight"
          >
            Voice AI
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <Link
              href="/login"
              className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors px-2 sm:px-0"
            >
              Sign In
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

