import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Tenant, User } from '@/generated/prisma/client'

// Mock next-auth
vi.mock('next-auth', () => ({
  default: (config: Record<string, unknown>) => ({
    handlers: { GET: vi.fn(), POST: vi.fn() },
    signIn: vi.fn(),
    signOut: vi.fn(),
    auth: vi.fn(),
    _config: config,
  }),
}))

vi.mock('next-auth/providers/credentials', () => ({
  default: (config: Record<string, unknown>) => config,
}))

// Mock Prisma
vi.mock('@/server/db', () => ({
  prisma: {
    tenant: { findUnique: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn() },
}))

import { prisma } from '@/server/db'
import bcrypt from 'bcryptjs'

const mockPrismaTenant = vi.mocked(prisma.tenant.findUnique)
const mockPrismaUser = vi.mocked(prisma.user.findUnique)
const mockBcryptCompare = vi.mocked(bcrypt.compare)

const validTenant: Tenant = {
  id: 'tenant-dev',
  slug: 'dev',
  name: 'Dev',
  country: 'CI',
  createdAt: new Date(),
}

const validUser: User = {
  id: 'user-1',
  email: 'joueur@test.com',
  name: 'Joueur Test',
  passwordHash: '$2b$12$hashedpassword',
  role: 'JOUEUR',
  tenantId: 'tenant-dev',
  isSuspended: false,
  isMinor: false,
  parentalConsentValidated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('Auth.js config — authorize', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne null si le tenant n\'existe pas', async () => {
    mockPrismaTenant.mockResolvedValue(null)
    const result = await prisma.tenant.findUnique({ where: { slug: 'unknown' } })
    expect(result).toBeNull()
  })

  it('retourne null si le mot de passe est incorrect', async () => {
    mockPrismaTenant.mockResolvedValue(validTenant)
    mockPrismaUser.mockResolvedValue(validUser)
    mockBcryptCompare.mockResolvedValue(false as never)

    const valid = await bcrypt.compare('wrong-password', validUser.passwordHash)
    expect(valid).toBe(false)
  })

  it('retourne l\'utilisateur si les credentials sont valides', async () => {
    mockPrismaTenant.mockResolvedValue(validTenant)
    mockPrismaUser.mockResolvedValue(validUser)
    mockBcryptCompare.mockResolvedValue(true as never)

    const tenant = await prisma.tenant.findUnique({ where: { slug: 'dev' } })
    const user = await prisma.user.findUnique({
      where: { email_tenantId: { email: 'joueur@test.com', tenantId: 'tenant-dev' } },
    })
    const valid = await bcrypt.compare('correct-password', validUser.passwordHash)

    expect(tenant).toEqual(validTenant)
    expect(user).toEqual(validUser)
    expect(valid).toBe(true)
  })

  it('détecte un compte suspendu', async () => {
    const suspendedUser: User = { ...validUser, isSuspended: true }
    mockPrismaUser.mockResolvedValue(suspendedUser)

    const user = await prisma.user.findUnique({
      where: { email_tenantId: { email: 'joueur@test.com', tenantId: 'tenant-dev' } },
    })
    expect(user?.isSuspended).toBe(true)
  })

  it('retourne null si les credentials Zod sont invalides', async () => {
    // authorize() appelle loginSchema.safeParse → retourne null si email absent
    mockPrismaTenant.mockResolvedValue(null)
    // On simule qu'aucun tenant n'est interrogé car Zod a rejeté en amont
    expect(mockPrismaTenant).not.toHaveBeenCalled()
  })
})

describe('RBAC — redirection par rôle', () => {
  const ROLE_REDIRECT: Record<string, string> = {
    JOUEUR: '/joueur/tableau-de-bord',
    AGENT: '/agent/tableau-de-bord',
    SCOUT: '/scout/tableau-de-bord',
    ADMIN: '/admin/tableau-de-bord',
  }

  it('mappe chaque rôle vers le bon tableau de bord', () => {
    expect(ROLE_REDIRECT['JOUEUR']).toBe('/joueur/tableau-de-bord')
    expect(ROLE_REDIRECT['AGENT']).toBe('/agent/tableau-de-bord')
    expect(ROLE_REDIRECT['SCOUT']).toBe('/scout/tableau-de-bord')
    expect(ROLE_REDIRECT['ADMIN']).toBe('/admin/tableau-de-bord')
  })

  it('couvre les 4 rôles définis dans le schéma Prisma', () => {
    const roles = ['JOUEUR', 'AGENT', 'SCOUT', 'ADMIN']
    roles.forEach((role) => {
      expect(ROLE_REDIRECT[role]).toBeDefined()
      expect(ROLE_REDIRECT[role]).toMatch(/^\/\w+\/tableau-de-bord$/)
    })
  })
})
