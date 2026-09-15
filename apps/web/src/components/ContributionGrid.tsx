import { useMemo, useState } from 'react'
import { colorForLevel, type Habit, type IsoDate } from '@lume/shared'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverAnchor } from '@/components/ui/popover'
import { buildCalendar } from '@/lib/calendar'
import { useTranslation } from '@/i18n'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearEntry, setEntry } from '@/store/habitsSlice'
import { selectEntriesByDate } from '@/store/selectors'
import { DayCell, EmptyCell } from './DayCell'
import { DayLevelPopover } from './DayLevelPopover'
import { GridLegend } from './GridLegend'

const LABELED_ROWS = [1, 3, 5]

interface ContributionGridProps {
  habit: Habit
}

export function ContributionGrid({ habit }: ContributionGridProps) {
  const dispatch = useAppDispatch()
  const { t, formatDate, formatMinutes, weekdays, months } = useTranslation()
  const entriesByDate = useAppSelector(selectEntriesByDate)
  const [openDate, setOpenDate] = useState<IsoDate | null>(null)

  const { weeks, months: markers } = useMemo(() => buildCalendar(), [])

  const activeDays = useMemo(
    () => Object.values(entriesByDate).filter((entry) => entry.level > 1).length,
    [entriesByDate]
  )

  const openLevel = openDate ? entriesByDate[openDate]?.level : undefined

  function handleSelect(date: IsoDate, level: number) {
    dispatch(setEntry({ habitId: habit.id, date, level }))
    setOpenDate(null)
  }

  function handleClear(date: IsoDate) {
    dispatch(clearEntry({ habitId: habit.id, date }))
    setOpenDate(null)
  }

  function minutesLabel(date: IsoDate): string {
    const entry = entriesByDate[date]
    if (!entry) return t('noRecord')
    const minutes =
      entry.minutes ?? habit.levels.find((item) => item.order === entry.level)?.minutes ?? 0
    return formatMinutes(minutes)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="text-base font-semibold tabular-nums text-brand-soft">
            {activeDays}
          </span>{' '}
          {t('activeDays')}
        </p>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          {t('lastYear')}
        </span>
      </div>

      <Popover open={openDate !== null} onOpenChange={(open) => !open && setOpenDate(null)}>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-1">
            <div className="flex gap-1 pl-9">
              {weeks.map((_, weekIndex) => {
                const marker = markers.find((item) => item.weekIndex === weekIndex)
                return (
                  <div key={weekIndex} className="w-3">
                    {marker ? (
                      <span className="block text-[10px] leading-none text-muted-foreground">
                        {months[marker.month]}
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-1">
              <div className="flex w-8 flex-col gap-1 pr-1 text-right">
                {weekdays.map((label, row) => (
                  <div key={label} className="flex h-3 items-center justify-end">
                    {LABELED_ROWS.includes(row) ? (
                      <span className="text-[10px] leading-none text-muted-foreground">
                        {label}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.days.map((day, dayIndex) => {
                    if (!day) return <EmptyCell key={`empty-${weekIndex}-${dayIndex}`} />

                    const isOpen = openDate === day.date
                    const level = entriesByDate[day.date]?.level ?? 1
                    const cell = (
                      <DayCell
                        color={colorForLevel(level, habit.levels.length)}
                        selected={isOpen}
                        onClick={() => setOpenDate(day.date)}
                      />
                    )

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          {isOpen ? <PopoverAnchor asChild>{cell}</PopoverAnchor> : cell}
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="font-medium tabular-nums">{formatDate(day.date)}</p>
                          <p className="tabular-nums text-muted-foreground">
                            {minutesLabel(day.date)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {openDate ? (
          <DayLevelPopover
            habit={habit}
            date={openDate}
            currentLevel={openLevel}
            onSelect={(level) => handleSelect(openDate, level)}
            onClear={() => handleClear(openDate)}
          />
        ) : null}
      </Popover>

      <div className="mt-4 flex justify-end">
        <GridLegend habit={habit} />
      </div>
    </div>
  )
}
