import { useState } from 'react'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import type { Habit } from '@lume/shared'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslation } from '@/i18n'
import { useAppDispatch } from '@/store/hooks'
import { deleteHabit } from '@/store/habitsSlice'
import { cn } from '@/lib/utils'
import { HabitFormDialog } from './HabitFormDialog'

const ITEM_CLASS =
  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-accent'

interface HabitMenuProps {
  habit: Habit
}

export function HabitMenu({ habit }: HabitMenuProps) {
  const dispatch = useAppDispatch()
  const { t, translateError } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleMenuOpenChange(open: boolean) {
    setMenuOpen(open)
    if (!open) {
      setConfirming(false)
      setError(null)
    }
  }

  function handleEdit() {
    setMenuOpen(false)
    setEditOpen(true)
  }

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      await dispatch(deleteHabit(habit.id)).unwrap()
      handleMenuOpenChange(false)
    } catch (err) {
      setError(translateError(err, 'errorDeleteHabit'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Popover open={menuOpen} onOpenChange={handleMenuOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('habitActions', { name: habit.name })}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className={cn(confirming ? 'w-68 p-3' : 'w-48 p-1')}>
          {confirming ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t('deleteConfirmTitle', { name: habit.name })}
                </p>
                <p className="text-xs text-muted-foreground">{t('deleteConfirmBody')}</p>
              </div>

              {error ? <p className="text-xs text-destructive">{error}</p> : null}

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleting}
                  onClick={() => setConfirming(false)}
                >
                  {t('cancel')}
                </Button>
                <Button variant="destructive" size="sm" disabled={deleting} onClick={handleDelete}>
                  {deleting ? t('deleting') : t('deleteAction')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <button type="button" onClick={handleEdit} className={ITEM_CLASS}>
                <Pencil className="size-4 text-muted-foreground" />
                {t('editHabit')}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className={cn(ITEM_CLASS, 'text-destructive hover:bg-destructive/10')}
              >
                <Trash2 className="size-4" />
                {t('deleteHabit')}
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>

      <HabitFormDialog habit={habit} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}
