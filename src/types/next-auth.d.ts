import type { Role } from '@/generated/prisma/client'

declare module 'next-auth' {
  interface User {
    role: Role
    tenantId: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      tenantId: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    tenantId: string
  }
}
