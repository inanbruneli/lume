import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { MAX_HABIT_LEVELS, MIN_HABIT_LEVELS, type IsoDate } from '@lume/shared'
import { extractError } from '@/lib/utils'
import {
  LANGUAGES,
  MONTHS,
  WEEKDAYS,
  translations,
  type Language,
  type TranslationKey
} from './translations'

const STORAGE_KEY = 'lume:language'

type Params = Record<string, string | number>

export interface I18nValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, params?: Params) => string
  formatDate: (date: IsoDate) => string
  formatMinutes: (minutes: number) => string
  translateError: (err: unknown, fallback: TranslationKey) => string
  weekdays: string[]
  months: string[]
}

const I18nContext = createContext<I18nValue | null>(null)

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}

function storedLanguage(): Language | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return isLanguage(value) ? value : null
  } catch {
    return null
  }
}

function detectLanguage(): Language {
  const stored = storedLanguage()
  if (stored) return stored
  const preferred = typeof navigator === 'undefined' ? '' : navigator.language
  return preferred.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match
  )
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage)

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      return
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey, params?: Params) => interpolate(translations[language][key], params),
    [language]
  )

  const formatDate = useCallback(
    (date: IsoDate) => {
      const [year, month, day] = date.split('-')
      return language === 'pt' ? `${day}/${month}/${year}` : `${month}/${day}/${year}`
    },
    [language]
  )

  const formatMinutes = useCallback(
    (minutes: number) => (minutes === 1 ? t('minuteOne') : t('minuteOther', { count: minutes })),
    [t]
  )

  const translateError = useCallback(
    (err: unknown, fallback: TranslationKey) => {
      const { code, message } = extractError(err)
      if (code && code in translations[language]) {
        return t(code as TranslationKey, { min: MIN_HABIT_LEVELS, max: MAX_HABIT_LEVELS })
      }
      if (message) return message
      return t(fallback)
    },
    [language, t]
  )

  const value = useMemo<I18nValue>(
    () => ({
      language,
      setLanguage,
      t,
      formatDate,
      formatMinutes,
      translateError,
      weekdays: WEEKDAYS[language],
      months: MONTHS[language]
    }),
    [language, setLanguage, t, formatDate, formatMinutes, translateError]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useTranslation must be used inside I18nProvider')
  return value
}

export type { Language, TranslationKey }
