import type {
  CreateHabitInput,
  DateRange,
  Habit,
  HabitEntry,
  IsoDate,
  UpdateHabitResult
} from '@lume/shared'

export interface HabitRepository {
  listHabits(): Promise<Habit[]>
  findHabit(id: string): Promise<Habit | null>
  createHabit(input: CreateHabitInput): Promise<Habit>
  updateHabit(
    id: string,
    input: CreateHabitInput,
    resolveLevel: (entry: HabitEntry, updated: Habit) => number
  ): Promise<UpdateHabitResult | null>
  deleteHabit(id: string): Promise<boolean>

  listEntries(habitId?: string, range?: DateRange): Promise<HabitEntry[]>
  setEntry(habitId: string, date: IsoDate, level: number, minutes?: number): Promise<HabitEntry>
  addSession(
    habitId: string,
    date: IsoDate,
    minutes: number,
    resolveLevel: (totalMinutes: number) => number
  ): Promise<HabitEntry>
  clearEntry(habitId: string, date: IsoDate): Promise<boolean>
}
