import { useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import { MAX_HABIT_LEVELS, MIN_HABIT_LEVELS, colorForLevel, type Habit } from '@lume/shared'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation, type TranslationKey } from '@/i18n'
import { useAppDispatch } from '@/store/hooks'
import { createHabit, updateHabit } from '@/store/habitsSlice'
import { cn } from '@/lib/utils'
import { LEVEL_CLASS } from './DayCell'

const schema = yup.object({
  name: yup.string().trim().required('nameRequired').max(60, 'nameTooLong'),
  levels: yup
    .array()
    .of(
      yup.object({
        minutes: yup
          .number()
          .integer()
          .min(0, 'minutesNonNegative')
          .required('minutesRequired')
      })
    )
    .min(MIN_HABIT_LEVELS, 'minLevels')
    .max(MAX_HABIT_LEVELS, 'maxLevels')
    .required()
})

type FormValues = yup.InferType<typeof schema>

const NEW_HABIT: FormValues = {
  name: '',
  levels: [{ minutes: 0 }, { minutes: 0 }, { minutes: 0 }]
}

interface HabitFormDialogProps {
  habit?: Habit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HabitFormDialog({ habit, open, onOpenChange }: HabitFormDialogProps) {
  const dispatch = useAppDispatch()
  const { t, translateError } = useTranslation()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const isEdit = habit !== undefined

  const initialValues = useMemo<FormValues>(
    () =>
      habit
        ? { name: habit.name, levels: habit.levels.map(({ minutes }) => ({ minutes })) }
        : NEW_HABIT,
    [habit]
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'levels' })

  useEffect(() => {
    if (open) {
      reset(initialValues)
      setSubmitError(null)
    }
  }, [open, reset, initialValues])

  function fieldError(message?: string): string | null {
    if (!message) return null
    const count = message === 'maxLevels' ? MAX_HABIT_LEVELS : MIN_HABIT_LEVELS
    return t(message as TranslationKey, { count })
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (habit) await dispatch(updateHabit({ id: habit.id, input: values })).unwrap()
      else await dispatch(createHabit(values)).unwrap()
      onOpenChange(false)
    } catch (err) {
      setSubmitError(translateError(err, isEdit ? 'errorSaveHabit' : 'errorCreateHabit'))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 ring-1 ring-inset ring-primary/25">
              {isEdit ? (
                <Pencil className="size-4 text-brand-soft" />
              ) : (
                <Sparkles className="size-4 text-brand-soft" />
              )}
            </span>
            <div className="space-y-1 text-left">
              <DialogTitle>{isEdit ? t('editHabit') : t('newHabit')}</DialogTitle>
              <DialogDescription>
                {isEdit ? t('editHabitHint') : t('newHabitHint')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="habit-name">{t('name')}</Label>
            <Input id="habit-name" placeholder={t('namePlaceholder')} {...register('name')} />
            {errors.name ? (
              <p className="text-xs text-destructive">{fieldError(errors.name.message)}</p>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('levels')}</Label>
              <span className="text-xs text-muted-foreground">
                {t('levelsCount', { count: fields.length, max: MAX_HABIT_LEVELS })}
              </span>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="animate-rise space-y-1"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="group/row flex items-center gap-2">
                    <span className="flex w-16 shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      {t('levelLabel', { n: index + 1 })}
                    </span>
                    <Input
                      placeholder="0"
                      type="number"
                      min="0"
                      {...register(`levels.${index}.minutes`)}
                    />
                    <span className="ml-2 text-xs text-muted-foreground">{t('minutesUnit')}</span>
                    <span
                      className={cn(
                        'ml-2 flex size-2.5 rounded-sm',
                        LEVEL_CLASS[colorForLevel(index + 1, fields.length)]
                      )}
                      title={t('levelLabel', { n: index + 1 })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t('removeLevel', { n: index + 1 })}
                      disabled={fields.length <= MIN_HABIT_LEVELS}
                      onClick={() => remove(index)}
                      className="text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  {errors.levels?.[index]?.minutes ? (
                    <p className="pl-[4.5rem] text-xs text-destructive">
                      {fieldError(errors.levels[index]?.minutes?.message)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {errors.levels?.message ? (
              <p className="text-xs text-destructive">{fieldError(errors.levels.message)}</p>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fields.length >= MAX_HABIT_LEVELS}
              onClick={() => append({ minutes: 0 })}
              className="group border-dashed transition-all duration-200 hover:border-solid hover:border-primary/50 hover:bg-primary/8 hover:text-brand-soft"
            >
              <Plus className="transition-transform duration-300 group-hover:rotate-90" />
              {t('addLevel')}
            </Button>
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="transition-all duration-300 hover:bg-brand-soft hover:shadow-[0_8px_24px_-6px_var(--color-brand)]"
            >
              {isSubmitting ? t('saving') : isEdit ? t('save') : t('createHabit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
