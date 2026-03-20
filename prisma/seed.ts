import { neonConfig } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Charge .env.local explicitement pour les scripts Node
dotenv.config({ path: '.env.local' })
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

  // Utilisateurs de test (dev uniquement)
  const users = [
    { email: 'joueur@test.com', name: 'Joueur Test', role: 'JOUEUR' as const },
    { email: 'agent@test.com', name: 'Agent Test', role: 'AGENT' as const },
    { email: 'scout@test.com', name: 'Scout Test', role: 'SCOUT' as const },
    { email: 'admin@test.com', name: 'Admin Test', role: 'ADMIN' as const },
  ]

  // Mot de passe : Test1234! (bcrypt coût 12)
  const passwordHash = '$2b$12$3K8nkx5tXM8Xk43.U9tL1uGFuKlSIRgPjonM0UC1mHLmKCtR1bQni'

  for (const u of users) {
    await prisma.user.upsert({
      where: { email_tenantId: { email: u.email, tenantId: devTenant.id } },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        tenantId: devTenant.id,
      },
    })
    console.log(`✅ Utilisateur ${u.role}: ${u.email}`)
  }
}

main()
  .catch((err) => {
    console.error('❌ Seed échoué:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
