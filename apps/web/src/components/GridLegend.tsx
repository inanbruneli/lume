import { colorForLevel, type Habit } from '@lume/shared'
import { useTranslation } from '@/i18n'
import { LEVEL_CLASS } from './DayCell'

interface GridLegendProps {
  habit: Habit
}

export function GridLegend({ habit }: GridLegendProps) {
  const { t, formatMinutes } = useTranslation()

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{t('less')}</span>
      <div className="flex gap-1">
        {habit.levels.map((level) => (
          <div
            key={level.order}
            title={t('legendLevel', {
              order: level.order,
              minutes: formatMinutes(level.minutes)
            })}
            className={`size-3 rounded-sm ring-1 ring-inset ring-white/5 ${
              LEVEL_CLASS[colorForLevel(level.order, habit.levels.length)]
            }`}
          />
        ))}
      </div>
      <span>{t('more')}</span>
    </div>
  )
}
