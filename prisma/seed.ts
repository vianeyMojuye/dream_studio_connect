import { neonConfig } from '@neondatabase/serverless'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Requis en environnement Node.js (CI, scripts) — pas nécessaire en Edge/Vercel
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Tenant de développement — utilisé pour les tests locaux et le seeding dev
  const devTenant = await prisma.tenant.upsert({
    where: { slug: 'dev' },
    update: {},
    create: {
      id: 'tenant-dev',
      name: 'Dream Studio Dev',
      slug: 'dev',
      country: 'CI',
    },
  })
  console.log(`✅ Tenant de développement: ${devTenant.id} (${devTenant.slug})`)
}

main()
  .catch((err) => {
    console.error('❌ Seed échoué:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
