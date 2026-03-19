import { Redis } from '@upstash/redis'

// Singleton Upstash Redis — compatible Edge Runtime Vercel
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Récupère une valeur depuis le cache Redis.
 * Retourne `null` si la clé n'existe pas ou a expiré.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  return redis.get<T>(key)
}

/**
 * Stocke une valeur dans le cache Redis avec TTL optionnel.
 * @param key - Clé unique (ex: `session:${userId}`, `search:${hash}`)
 * @param value - Valeur à stocker (sérialisée en JSON automatiquement)
 * @param ttlSeconds - Durée de vie en secondes (défaut : 3600 = 1h)
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds = 3600
): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds })
}

/**
 * Supprime une clé du cache Redis.
 */
export async function deleteCache(key: string): Promise<void> {
  await redis.del(key)
}

export { redis }
