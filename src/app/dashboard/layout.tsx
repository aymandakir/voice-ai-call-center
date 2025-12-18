import { DashboardNav } from '@/components/dashboard/nav'
import { getCurrentUser } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav />
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

