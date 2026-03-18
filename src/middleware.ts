// Middleware Next.js — Tenant routing + auth guard
// CRITIQUE: lit tenant_id et role depuis JWT claims (jamais depuis le body)
// Sera complété Stories 1.2 (tenant) + 1.3 (RBAC)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  // Stub — à implémenter Stories 1.2 + 1.3
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/joueur/:path*',
    '/agent/:path*',
    '/scout/:path*',
    '/admin/:path*',
  ],
}
