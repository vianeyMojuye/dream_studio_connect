import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const ROLE_REDIRECT: Record<string, string> = {
  JOUEUR: '/joueur/tableau-de-bord',
  AGENT: '/agent/tableau-de-bord',
  SCOUT: '/scout/tableau-de-bord',
  ADMIN: '/admin/tableau-de-bord',
}

export async function GET(req: NextRequest) {
  const session = await auth()
  const role = session?.user?.role as string | undefined
  const destination = (role && ROLE_REDIRECT[role]) ?? '/auth/connexion'
  return NextResponse.redirect(new URL(destination, req.url))
}
