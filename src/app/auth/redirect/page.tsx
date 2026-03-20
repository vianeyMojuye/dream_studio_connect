import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const ROLE_REDIRECT: Record<string, string> = {
  JOUEUR: '/joueur/tableau-de-bord',
  AGENT: '/agent/tableau-de-bord',
  SCOUT: '/scout/tableau-de-bord',
  ADMIN: '/admin/tableau-de-bord',
}

export default async function DashboardRedirectPage() {
  const session = await auth()
  const role = session?.user?.role as string | undefined
  const destination = (role && ROLE_REDIRECT[role]) ?? '/auth/connexion'
  redirect(destination)
}
