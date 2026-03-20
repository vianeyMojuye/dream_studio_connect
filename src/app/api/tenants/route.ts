import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

export async function GET() {
  const tenants = await prisma.tenant.findMany({
    select: { slug: true, name: true, country: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(tenants)
}
