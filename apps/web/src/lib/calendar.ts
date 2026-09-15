import type { IsoDate } from '@lume/shared'

export interface CalendarDay {
  date: IsoDate
  weekday: number
}

export interface CalendarWeek {
  days: (CalendarDay | null)[]
}

export interface MonthMarker {
  month: number
  weekIndex: number
}

const DAYS_IN_YEAR = 365

export function toIsoDate(date: Date): IsoDate {
  return date.toISOString().slice(0, 10)
}

export function todayIso(): IsoDate {
  const now = new Date()
  return toIsoDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

function buildMonthMarkers(weeks: CalendarWeek[]): MonthMarker[] {
  const markers: MonthMarker[] = []
  let lastMonth = -1

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.days.find((day): day is CalendarDay => day !== null)
    if (!firstDay) return
    const month = Number(firstDay.date.slice(5, 7)) - 1
    if (month === lastMonth) return
    lastMonth = month
    markers.push({ month, weekIndex })
  })

  return markers
}

export function buildCalendar(endDate: Date = new Date()): {
  weeks: CalendarWeek[]
  months: MonthMarker[]
} {
  const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()))
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (DAYS_IN_YEAR - 1))

  const days: CalendarDay[] = []
  for (let i = 0; i < DAYS_IN_YEAR; i++) {
    const current = new Date(start)
    current.setUTCDate(start.getUTCDate() + i)
    days.push({ date: toIsoDate(current), weekday: current.getUTCDay() })
  }

  const weeks: CalendarWeek[] = []
  let currentWeek: (CalendarDay | null)[] = Array.from(
    { length: days[0].weekday },
    () => null
  )

  for (const day of days) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek })
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push({ days: currentWeek })
  }

  return { weeks, months: buildMonthMarkers(weeks) }
}
