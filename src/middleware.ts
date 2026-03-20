import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

const ROLE_REDIRECT: Record<string, string> = {
  JOUEUR: '/joueur/tableau-de-bord',
  AGENT: '/agent/tableau-de-bord',
  SCOUT: '/scout/tableau-de-bord',
  ADMIN: '/admin/tableau-de-bord',
}

const ROLE_PREFIX: Record<string, string> = {
  JOUEUR: '/joueur',
  AGENT: '/agent',
  SCOUT: '/scout',
  ADMIN: '/admin',
}

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const path = nextUrl.pathname

  // Non authentifié → redirection vers connexion
  if (!session) {
    return NextResponse.redirect(new URL('/auth/connexion', req.url))
  }

  const role = session.user?.role as string | undefined
  if (!role) {
    return NextResponse.redirect(new URL('/auth/connexion', req.url))
  }

  const allowedPrefix = ROLE_PREFIX[role]

  // Mauvais rôle → redirection vers l'espace correct (AC3)
  if (allowedPrefix && !path.startsWith(allowedPrefix)) {
    const redirect = ROLE_REDIRECT[role] ?? '/auth/connexion'
    return NextResponse.redirect(new URL(redirect, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/joueur/:path*', '/agent/:path*', '/scout/:path*', '/admin/:path*'],
}
