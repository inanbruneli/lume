import { useEffect, useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import type { Habit } from '@lume/shared'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { todayIso } from '@/lib/calendar'
import { useTranslation } from '@/i18n'
import { useAppDispatch } from '@/store/hooks'
import { setEntry } from '@/store/habitsSlice'
import { HabitSelect } from './HabitSelect'

interface LogDayDialogProps {
  habits: Habit[]
  defaultHabitId: string | null
}

export function LogDayDialog({ habits, defaultHabitId }: LogDayDialogProps) {
  const dispatch = useAppDispatch()
  const { t, formatMinutes, translateError } = useTranslation()
  const [open, setOpen] = useState(false)
  const [habitId, setHabitId] = useState<string | null>(defaultHabitId)
  const [date, setDate] = useState(todayIso())
  const [level, setLevel] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const habit = habits.find((item) => item.id === habitId) ?? null

  useEffect(() => {
    if (!open) return
    setHabitId(defaultHabitId)
    setDate(todayIso())
    setLevel('')
    setError(null)
  }, [open, defaultHabitId])

  function handleHabitChange(nextId: string) {
    setHabitId(nextId)
    setLevel('')
  }

  async function handleSubmit() {
    if (!habitId || !level) {
      setError(t('logDayMissing'))
      return
    }
    setSaving(true)
    setError(null)
    try {
      await dispatch(setEntry({ habitId, date, level: Number(level) })).unwrap()
      setOpen(false)
    } catch (err) {
      setError(translateError(err, 'errorSaveEntry'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={habits.length === 0}>
          <CalendarPlus />
          {t('logDay')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('logDay')}</DialogTitle>
          <DialogDescription>{t('logDayHint')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('habit')}</Label>
            <HabitSelect habits={habits} value={habitId} onChange={handleHabitChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="log-date">{t('date')}</Label>
            <Input
              id="log-date"
              type="date"
              value={date}
              max={todayIso()}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('level')}</Label>
            <Select value={level} onValueChange={setLevel} disabled={!habit}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectLevel')} />
              </SelectTrigger>
              <SelectContent>
                {habit?.levels.map((item) => (
                  <SelectItem key={item.order} value={String(item.order)}>
                    {t('levelOption', {
                      order: item.order,
                      minutes: formatMinutes(item.minutes)
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
