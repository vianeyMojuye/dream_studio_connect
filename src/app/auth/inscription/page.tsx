import { RegisterForm } from '@/components/auth/RegisterForm'

type Props = {
  searchParams: Promise<{ role?: string }>
}

export default async function InscriptionPage({ searchParams }: Props) {
  const params = await searchParams
  const role = params.role === 'AGENT' ? 'AGENT' : 'JOUEUR'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Dream Studio Connect</h1>
          <p className="text-sm text-muted-foreground">Créez votre compte</p>
        </div>
        <RegisterForm defaultRole={role} />
      </div>
    </main>
  )
}
