import { config } from "dotenv";
// Charger .env.local en priorité (contient les vraies URLs Neon), puis .env comme fallback
config({ path: ".env.local", override: true });
config();
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // DIRECT_URL pour les migrations CLI (bypass PgBouncer Neon)
    // DATABASE_URL (pooled) est utilisé par le runtime via PrismaNeon adapter
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
