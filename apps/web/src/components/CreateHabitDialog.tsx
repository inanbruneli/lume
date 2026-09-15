import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'
import { HabitFormDialog } from './HabitFormDialog'

export function CreateHabitDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className={cn(
          'group relative overflow-hidden font-medium',
          'shadow-[0_0_0_0_var(--color-brand)] transition-all duration-300',
          'hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-[0_8px_24px_-6px_var(--color-brand)]',
          'active:translate-y-0 active:duration-75'
        )}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
        <Plus className="transition-transform duration-300 group-hover:rotate-90" />
        {t('newHabit')}
      </Button>

      <HabitFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
