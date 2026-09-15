import { colorForLevel, type Habit, type IsoDate } from '@lume/shared'
import { Button } from '@/components/ui/button'
import { PopoverContent } from '@/components/ui/popover'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'
import { LEVEL_CLASS } from './DayCell'

interface DayLevelPopoverProps {
  habit: Habit
  date: IsoDate
  currentLevel?: number
  onSelect: (level: number) => void
  onClear: () => void
}

export function DayLevelPopover({
  habit,
  date,
  currentLevel,
  onSelect,
  onClear
}: DayLevelPopoverProps) {
  const { t, formatDate, formatMinutes } = useTranslation()

  return (
    <PopoverContent className="w-64" align="start">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">{formatDate(date)}</p>
          <p className="text-xs text-muted-foreground">{habit.name}</p>
        </div>

        <div className="space-y-1">
          {habit.levels.map((level) => (
            <button
              key={level.order}
              type="button"
              onClick={() => onSelect(level.order)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition',
                'hover:bg-accent',
                currentLevel === level.order && 'bg-accent'
              )}
            >
              <span
                className={cn(
                  'size-3 shrink-0 rounded-sm ring-1 ring-inset ring-white/10',
                  LEVEL_CLASS[colorForLevel(level.order, habit.levels.length)]
                )}
              />
              <span className="truncate">
                {t('legendLevel', {
                  order: level.order,
                  minutes: formatMinutes(level.minutes)
                })}
              </span>
            </button>
          ))}
        </div>

        {currentLevel !== undefined ? (
          <Button variant="ghost" size="sm" className="w-full" onClick={onClear}>
            {t('clearRecord')}
          </Button>
        ) : null}
      </div>
    </PopoverContent>
  )
}
