import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerUser } from './register'
import type { RegisterResult } from './register-schema'

// Mock Prisma
vi.mock('@/server/db', () => ({
  prisma: {
    tenant: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Mock bcrypt — évite le vrai hachage en test
vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn().mockResolvedValue('hashed_password') },
  hash: vi.fn().mockResolvedValue('hashed_password'),
}))

import { prisma } from '@/server/db'
import type { Tenant, User } from '@/generated/prisma/client'

const mockTenant: Tenant = {
  id: 'tenant-1', slug: 'dev', name: 'Dev', country: 'CM', createdAt: new Date(),
}

const mockUser: User = {
  id: 'user-1', email: 'joueur@test.com', role: 'JOUEUR', name: 'Jean',
  passwordHash: 'hashed', isMinor: false, parentalConsentValidated: false,
  isSuspended: false, tenantId: 'tenant-1', createdAt: new Date(), updatedAt: new Date(),
}

function getError(result: RegisterResult): string {
  if (!result.success) return result.error
  throw new Error('Expected failure result')
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(prisma.tenant.findUnique).mockResolvedValue(mockTenant)
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
  vi.mocked(prisma.user.create).mockResolvedValue(mockUser)
})

describe('registerUser', () => {
  it('T1 — crée un compte JOUEUR avec succès', async () => {
    const result = await registerUser({
      email: 'joueur@test.com', password: 'password123', name: 'Jean',
      role: 'JOUEUR', tenantSlug: 'dev', isMinor: false, parentalConsentGiven: false,
    })
    expect(result.success).toBe(true)
  })

  it('T2 — crée un compte AGENT avec succès', async () => {
    const result = await registerUser({
      email: 'agent@test.com', password: 'password123', name: 'Paul',
      role: 'AGENT', tenantSlug: 'dev', isMinor: false, parentalConsentGiven: false,
    })
    expect(result.success).toBe(true)
  })

  it('T3 — rejette un mot de passe trop court', async () => {
    const result = await registerUser({
      email: 'test@test.com', password: 'abc', name: 'Test',
      role: 'JOUEUR', tenantSlug: 'dev', isMinor: false, parentalConsentGiven: false,
    })
    expect(result.success).toBe(false)
    expect(getError(result)).toMatch(/court/i)
  })

  it('T4 — rejette un email invalide', async () => {
    const result = await registerUser({
      email: 'invalid-email', password: 'password123', name: 'Test',
      role: 'JOUEUR', tenantSlug: 'dev', isMinor: false, parentalConsentGiven: false,
    })
    expect(result.success).toBe(false)
    expect(getError(result)).toMatch(/email/i)
  })

  it('T5 — rejette un email déjà utilisé', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
    const result = await registerUser({
      email: 'existing@test.com', password: 'password123', name: 'Test',
      role: 'JOUEUR', tenantSlug: 'dev', isMinor: false, parentalConsentGiven: false,
    })
    expect(result.success).toBe(false)
    expect(getError(result)).toMatch(/déjà utilisée/i)
  })

  it('T6 — mineur sans consentement parental → rejeté', async () => {
    const result = await registerUser({
      email: 'mineur@test.com', password: 'password123', name: 'Junior',
      role: 'JOUEUR', tenantSlug: 'dev', isMinor: true, parentalConsentGiven: false,
    })
    expect(result.success).toBe(false)
    expect(getError(result)).toMatch(/consentement parental/i)
  })

  it('T7 — mineur avec consentement → compte créé, isMinor=true', async () => {
    vi.mocked(prisma.user.create).mockResolvedValue({ ...mockUser, isMinor: true })
    const result = await registerUser({
      email: 'mineur@test.com', password: 'password123', name: 'Junior',
      role: 'JOUEUR', tenantSlug: 'dev', isMinor: true, parentalConsentGiven: true,
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.isMinor).toBe(true)
  })

  it('T8 — tenant introuvable → erreur', async () => {
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue(null)
    const result = await registerUser({
      email: 'test@test.com', password: 'password123', name: 'Test',
      role: 'JOUEUR', tenantSlug: 'unknown', isMinor: false, parentalConsentGiven: false,
    })
    expect(result.success).toBe(false)
    expect(getError(result)).toMatch(/tenant/i)
  })
})
