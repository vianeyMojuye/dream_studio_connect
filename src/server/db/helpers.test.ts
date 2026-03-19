import { describe, it, expect } from 'vitest'
import { withTenant } from './helpers'

describe('withTenant', () => {
  it('retourne { tenantId } avec la valeur fournie', () => {
    const result = withTenant('tenant-abc')
    expect(result).toEqual({ tenantId: 'tenant-abc' })
  })

  it('retourne un objet avec exactement la clé tenantId', () => {
    const result = withTenant('tenant-xyz')
    expect(Object.keys(result)).toHaveLength(1)
    expect(result.tenantId).toBe('tenant-xyz')
  })

  it('fonctionne avec le tenant de développement par défaut', () => {
    const result = withTenant('tenant-dev')
    expect(result).toEqual({ tenantId: 'tenant-dev' })
  })

  it('peut être spreade dans un objet where Prisma', () => {
    const tenantId = 'tenant-prod'
    const whereClause = {
      ...withTenant(tenantId),
      isSuspended: false,
      role: 'JOUEUR',
    }
    expect(whereClause).toEqual({
      tenantId: 'tenant-prod',
      isSuspended: false,
      role: 'JOUEUR',
    })
  })
})
