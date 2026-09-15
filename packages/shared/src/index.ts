export type IsoDate = string

export type ColorLevel = 0 | 1 | 2 | 3 | 4

export const MIN_HABIT_LEVELS = 2
export const MAX_HABIT_LEVELS = 5

export type ErrorCode =
  | 'HABIT_NAME_REQUIRED'
  | 'HABIT_LEVEL_COUNT'
  | 'LEVEL_MINUTES_INVALID'
  | 'LEVEL_MINUTES_DECREASING'
  | 'INVALID_DATE'
  | 'INVALID_LEVEL'
  | 'MINUTES_INVALID'
  | 'HABIT_NOT_FOUND'
  | 'ENTRY_NOT_FOUND'

export interface HabitLevel {
  order: number
  minutes: number
}

export interface Habit {
  id: string
  name: string
  levels: HabitLevel[]
  createdAt: string
}

export interface HabitEntry {
  habitId: string
  date: IsoDate
  level: number
  minutes?: number
}

export interface DateRange {
  from: IsoDate
  to: IsoDate
}

export interface UpdateHabitResult {
  habit: Habit
  entries: HabitEntry[]
}

export interface CreateHabitInput {
  name: string
  levels: { minutes: number }[]
}

export function levelFromMinutes(minutes: number, levels: HabitLevel[]): number {
  const sorted = [...levels].sort((a, b) => a.minutes - b.minutes)
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (minutes >= sorted[i].minutes) {
      return sorted[i].order
    }
  }
  return 1
}

export function colorForLevel(level: number, totalLevels: number): ColorLevel {
  const LEVEL_COLOR_SCALES: Record<number, ColorLevel[]> = {
    2: [0, 4],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4]
  }
  const scale = LEVEL_COLOR_SCALES[totalLevels]
  if (!scale) return 0
  return scale[level - 1] ?? 0
}
