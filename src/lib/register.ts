'use server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/server/db'
import { registerSchema } from './register-schema'
import type { RegisterInput, RegisterResult } from './register-schema'

export async function registerUser(data: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' }
  }

  const { email, password, name, role, tenantSlug, isMinor, parentalConsentGiven } = parsed.data

  if (isMinor && !parentalConsentGiven) {
    return { success: false, error: 'Le consentement parental est requis pour les mineurs' }
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })
  if (!tenant) {
    return { success: false, error: 'Tenant introuvable' }
  }

  const existing = await prisma.user.findUnique({
    where: { email_tenantId: { email, tenantId: tenant.id } },
  })
  if (existing) {
    return { success: false, error: 'Cette adresse email est déjà utilisée' }
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
      tenantId: tenant.id,
      isMinor,
      parentalConsentValidated: false,
    },
  })

  // Mock confirmation email — à remplacer par un vrai service
  console.log(`[inscription] ✅ Compte créé : ${email} (${role}, tenant: ${tenantSlug}, mineur: ${isMinor})`)

  return { success: true, isMinor }
}
