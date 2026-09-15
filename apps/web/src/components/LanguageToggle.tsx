import { useTranslation } from '@/i18n'
import { LANGUAGES, LANGUAGE_LABELS } from '@/i18n/translations'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('language')}
      className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5 ring-1 ring-inset ring-border"
    >
      {LANGUAGES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          className={cn(
            'rounded-md px-2 py-1 text-xs font-medium transition-colors',
            language === option
              ? 'bg-primary/15 text-brand-soft'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {LANGUAGE_LABELS[option]}
        </button>
      ))}
    </div>
  )
}
