'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { signUpSchema, type SignUpInput } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fadeInUp } from '@/lib/animations'
import { Sparkles } from 'lucide-react'
import { ORG_ID } from '@/lib/org-context'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    organization_name: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data: SignUpInput = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        organization_name: formData.organization_name,
      }
      signUpSchema.parse(data)

      const supabase = createClient()

      // Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (!authData.user) {
        setError('Failed to create user')
        return
      }

      // Create profile
      const { error: profileError } = await (supabase.from('profiles') as any).insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.full_name,
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Continue anyway - profile can be created later
      }

      // Add user to voice-demo organization (multi-tenant isolation)
      const { error: memberError } = await (supabase.from('organization_members') as any).insert({
        organization_id: ORG_ID,
        user_id: authData.user.id,
        role: 'member',
      })

      if (memberError) {
        console.error('Member creation error:', memberError)
        setError('Failed to add you to organization')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === 'object' && err !== null && 'issues' in err) {
        setError('Please check your input')
      } else {
        setError('An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-black dark:to-gray-900 px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16 xl:py-20">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(52, 199, 89, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {typeof window !== 'undefined' &&
        [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
            <motion.div
              className="mb-3 sm:mb-4 lg:mb-6 inline-flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0051D5] shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
            </motion.div>
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light tracking-tight text-white mb-2 sm:mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ letterSpacing: '-0.02em' }}
            >
              Create Account
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-400 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Start building your AI voice call center
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-red-500/20 backdrop-blur-xl border border-red-500/30 p-3 sm:p-4 text-xs sm:text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="full_name" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                onFocus={() => setFocusedField('full_name')}
                onBlur={() => setFocusedField(null)}
                required
                className="text-white placeholder:text-gray-500 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                className="text-white placeholder:text-gray-500 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={8}
                className="text-white placeholder:text-gray-500 text-sm sm:text-base"
              />
              <p className="mt-2 text-xs sm:text-sm text-gray-400">Must be at least 8 characters</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Label htmlFor="organization_name" className="text-sm sm:text-base">Organization Name</Label>
              <Input
                id="organization_name"
                type="text"
                placeholder="Acme Inc"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                onFocus={() => setFocusedField('organization_name')}
                onBlur={() => setFocusedField(null)}
                required
                className="text-white placeholder:text-gray-500 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white font-medium text-sm sm:text-base lg:text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>

            <motion.p
              className="text-center text-xs sm:text-sm lg:text-base text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-[#007AFF] hover:text-[#0051D5] transition-colors"
              >
                Sign in
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
