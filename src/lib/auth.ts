import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/server/db'
import { authConfig } from './auth.config'


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
          // DEBUG: log le slug du tenant récupéré
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          throw new Error('Données invalides')
        }

        const { email, password } = parsed.data

        // Recherche le premier utilisateur avec cet email
        const user = await prisma.user.findFirst({ where: { email } })
        if (!user) {
          throw new Error("Utilisateur inexistant")
        }

        // Vérifie le mot de passe
        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
          throw new Error('Mot de passe incorrect')
        }

        if (user.isSuspended) {
          throw new Error('Compte suspendu')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        }
      },
    }),
  ],
})
