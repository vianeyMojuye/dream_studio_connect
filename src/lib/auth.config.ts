import type { NextAuthConfig } from 'next-auth'

/**
 * Config Edge-compatible (sans Prisma) utilisée par le middleware.
 * L'authorize complet (avec Prisma) reste dans auth.ts.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = user as any
        token.role = u.role
        token.tenantId = u.tenantId
        token.tenantSlug = u.tenantSlug
      }
      return token
    },
    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = session as any
      s.user.role = token.role
      s.user.tenantId = token.tenantId
      s.user.tenantSlug = token.tenantSlug
      return session
    },
    authorized({ auth }) {
      return !!auth
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/connexion',
  },
}
