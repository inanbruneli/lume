import type { Habit } from '@lume/shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

interface HabitSelectProps {
  habits: Habit[]
  value: string | null
  onChange: (habitId: string) => void
  className?: string
  placeholder?: string
}

export function HabitSelect({
  habits,
  value,
  onChange,
  className,
  placeholder
}: HabitSelectProps) {
  const { t } = useTranslation()

  return (
    <Select value={value ?? undefined} onValueChange={onChange}>
      <SelectTrigger className={cn('w-72', className)}>
        <SelectValue placeholder={placeholder ?? t('selectHabit')} />
      </SelectTrigger>
      <SelectContent>
        {habits.map((habit) => (
          <SelectItem key={habit.id} value={habit.id}>
            {habit.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
