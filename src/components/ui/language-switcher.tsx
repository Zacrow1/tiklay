"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Languages } from 'lucide-react'

const languages = [
  { value: 'es', label: 'Español', flag: '🇦🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' }
]

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center space-x-2">
          <Languages className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}