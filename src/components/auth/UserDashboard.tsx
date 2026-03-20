'use client'

import { useSession, signOut } from 'next-auth/react'

export function UserDashboard({ role }: { role: string }) {
  const { data: session } = useSession()

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de bord — {role}</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/connexion' })}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          Se déconnecter
        </button>
      </div>

      {session && (
        <div className="rounded-lg border p-4 space-y-2 text-sm">
          <p><span className="font-medium">Nom :</span> {session.user.name}</p>
          <p><span className="font-medium">Email :</span> {session.user.email}</p>
          <p><span className="font-medium">Rôle :</span> {session.user.role}</p>
          <p><span className="font-medium">Tenant :</span> {session.user.tenantId}</p>
        </div>
      )}
    </main>
  )
}
