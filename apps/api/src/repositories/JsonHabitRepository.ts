import { randomUUID } from 'node:crypto'
import type {
  CreateHabitInput,
  DateRange,
  Habit,
  HabitEntry,
  IsoDate,
  UpdateHabitResult
} from '@lume/shared'
import type { UserDataStore } from '../db/userDataStore.js'
import type { HabitRepository } from './HabitRepository.js'

function inRange(date: IsoDate, range?: DateRange): boolean {
  if (!range) return true
  return date >= range.from && date <= range.to
}

export class JsonHabitRepository implements HabitRepository {
  constructor(
    private readonly store: UserDataStore,
    private readonly owner: string
  ) {}

  async listHabits(): Promise<Habit[]> {
    const db = await this.store.read(this.owner)
    return db.habits
  }

  async findHabit(id: string): Promise<Habit | null> {
    const db = await this.store.read(this.owner)
    return db.habits.find((habit) => habit.id === id) ?? null
  }

  async createHabit(input: CreateHabitInput): Promise<Habit> {
    return this.store.mutate(this.owner, (db) => {
      const habit: Habit = {
        id: randomUUID(),
        name: input.name,
        levels: input.levels.map((level, index) => ({
          order: index + 1,
          minutes: level.minutes
        })),
        createdAt: new Date().toISOString()
      }
      db.habits.push(habit)
      return habit
    })
  }

  async updateHabit(
    id: string,
    input: CreateHabitInput,
    resolveLevel: (entry: HabitEntry, updated: Habit) => number
  ): Promise<UpdateHabitResult | null> {
    return this.store.mutate(this.owner, (db) => {
      const habit = db.habits.find((item) => item.id === id)
      if (!habit) return null

      habit.name = input.name
      habit.levels = input.levels.map((level, index) => ({
        order: index + 1,
        minutes: level.minutes
      }))

      const entries = db.entries.filter((entry) => entry.habitId === id)
      for (const entry of entries) {
        entry.level = resolveLevel(entry, habit)
      }

      return { habit, entries }
    })
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.store.mutate(this.owner, (db) => {
      const index = db.habits.findIndex((habit) => habit.id === id)
      if (index === -1) return false
      db.habits.splice(index, 1)
      db.entries = db.entries.filter((entry) => entry.habitId !== id)
      return true
    })
  }

  async listEntries(habitId?: string, range?: DateRange): Promise<HabitEntry[]> {
    const db = await this.store.read(this.owner)
    return db.entries.filter(
      (entry) =>
        (habitId === undefined || entry.habitId === habitId) && inRange(entry.date, range)
    )
  }

  async setEntry(
    habitId: string,
    date: IsoDate,
    level: number,
    minutes?: number
  ): Promise<HabitEntry> {
    return this.store.mutate(this.owner, (db) => {
      const existing = db.entries.find(
        (entry) => entry.habitId === habitId && entry.date === date
      )
      if (existing) {
        existing.level = level
        if (minutes === undefined) delete existing.minutes
        else existing.minutes = minutes
        return existing
      }
      const entry: HabitEntry = { habitId, date, level }
      if (minutes !== undefined) entry.minutes = minutes
      db.entries.push(entry)
      return entry
    })
  }

  async addSession(
    habitId: string,
    date: IsoDate,
    minutes: number,
    resolveLevel: (totalMinutes: number) => number
  ): Promise<HabitEntry> {
    return this.store.mutate(this.owner, (db) => {
      const existing = db.entries.find(
        (entry) => entry.habitId === habitId && entry.date === date
      )
      const total = (existing?.minutes ?? 0) + minutes

      if (existing) {
        existing.minutes = total
        existing.level = resolveLevel(total)
        return existing
      }

      const entry: HabitEntry = {
        habitId,
        date,
        level: resolveLevel(total),
        minutes: total
      }
      db.entries.push(entry)
      return entry
    })
  }

  async clearEntry(habitId: string, date: IsoDate): Promise<boolean> {
    return this.store.mutate(this.owner, (db) => {
      const index = db.entries.findIndex(
        (entry) => entry.habitId === habitId && entry.date === date
      )
      if (index === -1) return false
      db.entries.splice(index, 1)
      return true
    })
  }
}
