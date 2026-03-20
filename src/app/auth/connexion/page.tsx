import { getTranslations } from 'next-intl/server'
import { LoginForm } from '@/components/auth/LoginForm'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export default async function ConnexionPage() {
  const t = await getTranslations('auth.connexion')

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground">
          {t('create_account')}{' '}
          <a href="/auth/inscription" className="underline hover:text-foreground">
            {t('create_link')}
          </a>
        </p>
      </div>
    </main>
  )
}
