// withTenant — wrapper Prisma pour isolation multi-tenant
// CRITIQUE: toute query doit passer par ce helper (Story 1.2)
// Signature attendue :
// export function withTenant(tenantId: string) {
//   return { where: { tenantId } }
// }
export {}
