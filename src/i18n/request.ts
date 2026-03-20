import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import type { Locale } from './config'
import { defaultLocale, locales } from './config'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('locale')?.value as Locale | undefined
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale

  const messages = await (
    locale === 'en'
      ? import('../../messages/en.json')
      : import('../../messages/fr.json')
  )

  return {
    locale,
    messages: messages.default as Record<string, unknown>,
  }
})
