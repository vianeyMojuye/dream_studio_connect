import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
const mockSet = vi.fn()
const mockDel = vi.fn()

// Mocker @upstash/redis avec une classe réelle (les arrow functions ne sont pas constructibles)
vi.mock('@upstash/redis', () => ({
  Redis: class MockRedis {
    get = mockGet
    set = mockSet
    del = mockDel
  },
}))

const { getCache, setCache, deleteCache } = await import('./redis')

describe('getCache', () => {
  beforeEach(() => vi.clearAllMocks())

  it('appelle redis.get avec la bonne clé', async () => {
    mockGet.mockResolvedValueOnce({ userId: '123' })
    const result = await getCache<{ userId: string }>('session:123')
    expect(mockGet).toHaveBeenCalledWith('session:123')
    expect(result).toEqual({ userId: '123' })
  })

  it("retourne null si la clé n'existe pas", async () => {
    mockGet.mockResolvedValueOnce(null)
    const result = await getCache('missing-key')
    expect(result).toBeNull()
  })
})

describe('setCache', () => {
  beforeEach(() => vi.clearAllMocks())

  it('appelle redis.set avec TTL par défaut (3600)', async () => {
    mockSet.mockResolvedValueOnce('OK')
    await setCache('search:abc', { results: [] })
    expect(mockSet).toHaveBeenCalledWith('search:abc', { results: [] }, { ex: 3600 })
  })

  it('respecte le TTL personnalisé', async () => {
    mockSet.mockResolvedValueOnce('OK')
    await setCache('temp:key', 'value', 60)
    expect(mockSet).toHaveBeenCalledWith('temp:key', 'value', { ex: 60 })
  })
})

describe('deleteCache', () => {
  beforeEach(() => vi.clearAllMocks())

  it('appelle redis.del avec la bonne clé', async () => {
    mockDel.mockResolvedValueOnce(1)
    await deleteCache('session:old')
    expect(mockDel).toHaveBeenCalledWith('session:old')
  })
})
