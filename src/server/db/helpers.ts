/**
 * OBLIGATOIRE — Toute query Prisma DOIT utiliser ce helper.
 *
 * Retourne le filtre WHERE tenant_id pour assurer l'isolation multi-tenant.
 * Le `tenantId` est extrait de la session Auth.js côté serveur — jamais du body client.
 *
 * @example
 * // ✅ Correct
 * const users = await prisma.user.findMany({
 *   where: { ...withTenant(tenantId), isSuspended: false },
 * })
 *
 * // ❌ Interdit — query sans filtre tenant
 * const users = await prisma.user.findMany()
 */
export function withTenant(tenantId: string): { tenantId: string } {
  return { tenantId }
}
