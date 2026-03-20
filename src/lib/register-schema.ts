import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(8, { message: 'Mot de passe trop court (minimum 8 caractères)' }),
  name: z.string().min(1, { message: 'Nom requis' }),
  role: z.enum(['JOUEUR', 'AGENT'], { message: 'Rôle invalide' }),
  tenantSlug: z.string().min(1, { message: 'Tenant requis' }),
  isMinor: z.boolean(),
  parentalConsentGiven: z.boolean(),
})

export type RegisterInput = z.infer<typeof registerSchema>

export type RegisterResult =
  | { success: true; isMinor: boolean }
  | { success: false; error: string }
