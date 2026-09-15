import { Sparkles } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { CreateHabitDialog } from './CreateHabitDialog'

export function EmptyState() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/15 [animation-duration:3s]" />
        <span className="relative grid size-12 place-items-center rounded-2xl bg-primary/12 ring-1 ring-inset ring-primary/25">
          <Sparkles className="size-5 text-brand-soft" />
        </span>
      </div>
      <div className="space-y-1.5">
        <p className="text-base font-medium">{t('emptyTitle')}</p>
        <p className="max-w-xs text-sm text-muted-foreground">{t('emptyBody')}</p>
      </div>
      <CreateHabitDialog />
    </div>
  )
}
