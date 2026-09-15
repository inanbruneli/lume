import { Flame } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/i18n'
import { LanguageToggle } from './LanguageToggle'

interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="mb-10 animate-rise">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/12 ring-1 ring-inset ring-primary/25">
          <Flame className="size-4.5 text-brand-soft" />
        </span>
        <div>
          <h1 className="text-gradient flex items-baseline gap-2 text-3xl font-semibold tracking-tight">
            {t('appName')}
            <span className="text-xl">{t('tagline')}</span>
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{t('welcomeBack')}</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {children}
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}
