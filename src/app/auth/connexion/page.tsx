import { LoginForm } from '@/components/auth/LoginForm'

export default function ConnexionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Dream Studio Connect</h1>
          <p className="text-sm text-muted-foreground">Connectez-vous à votre espace</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground">
          Pas encore de compte ?{' '}
          <a href="/auth/inscription" className="underline hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary rounded">
            Créer un compte
          </a>
        </p>
      </div>
    </main>
  )
}
