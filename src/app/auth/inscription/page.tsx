import { getTranslations } from 'next-intl/server'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

type Props = {
  searchParams: Promise<{ role?: string; tenantSlug?: string }>
}

export default async function InscriptionPage({ searchParams }: Props) {
  const params = await searchParams
  const t = await getTranslations('auth.inscription')
  const role = params.role === 'AGENT' ? 'AGENT' : 'JOUEUR'
  const tenantSlug = params.tenantSlug ?? 'dev'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <RegisterForm defaultRole={role} defaultTenantSlug={tenantSlug} />
      </div>
    </main>
  )
}
