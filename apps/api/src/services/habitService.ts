import {
  MAX_HABIT_LEVELS,
  MIN_HABIT_LEVELS,
  levelFromMinutes,
  type CreateHabitInput,
  type DateRange,
  type ErrorCode,
  type Habit,
  type HabitEntry,
  type IsoDate,
  type UpdateHabitResult
} from '@lume/shared'
import type { HabitRepository } from '../repositories/HabitRepository.js'

export class ValidationError extends Error {
  readonly code: ErrorCode

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export class NotFoundError extends Error {
  readonly code: ErrorCode

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export class HabitService {
  constructor(private readonly repository: HabitRepository) {}

  listHabits(): Promise<Habit[]> {
    return this.repository.listHabits()
  }

  private validateInput(input: CreateHabitInput): CreateHabitInput {
    const name = input.name?.trim()
    if (!name) {
      throw new ValidationError('HABIT_NAME_REQUIRED', 'Habit name is required')
    }

    const levels = input.levels ?? []
    if (levels.length < MIN_HABIT_LEVELS || levels.length > MAX_HABIT_LEVELS) {
      throw new ValidationError(
        'HABIT_LEVEL_COUNT',
        `A habit must have between ${MIN_HABIT_LEVELS} and ${MAX_HABIT_LEVELS} levels`
      )
    }

    for (const level of levels) {
      if (typeof level.minutes !== 'number' || level.minutes < 0) {
        throw new ValidationError(
          'LEVEL_MINUTES_INVALID',
          'Level minutes must be a non-negative number'
        )
      }
    }

    for (let i = 1; i < levels.length; i++) {
      if (levels[i].minutes < levels[i - 1].minutes) {
        throw new ValidationError(
          'LEVEL_MINUTES_DECREASING',
          'Level minutes must be non-decreasing'
        )
      }
    }

    return { name, levels: levels.map(({ minutes }) => ({ minutes })) }
  }

  createHabit(input: CreateHabitInput): Promise<Habit> {
    return this.repository.createHabit(this.validateInput(input))
  }

  async updateHabit(id: string, input: CreateHabitInput): Promise<UpdateHabitResult> {
    const validated = this.validateInput(input)

    const result = await this.repository.updateHabit(id, validated, (entry, updated) =>
      entry.minutes === undefined
        ? Math.min(entry.level, updated.levels.length)
        : levelFromMinutes(entry.minutes, updated.levels)
    )
    if (!result) throw new NotFoundError('HABIT_NOT_FOUND', 'Habit not found')

    return result
  }

  deleteHabit(id: string): Promise<boolean> {
    return this.repository.deleteHabit(id)
  }

  listEntries(habitId?: string, range?: DateRange): Promise<HabitEntry[]> {
    return this.repository.listEntries(habitId, range)
  }

  async setEntry(
    habitId: string,
    date: IsoDate,
    level: number,
    minutes?: number
  ): Promise<HabitEntry> {
    if (!ISO_DATE.test(date)) {
      throw new ValidationError('INVALID_DATE', 'Invalid date (use YYYY-MM-DD)')
    }

    const habit = await this.repository.findHabit(habitId)
    if (!habit) throw new NotFoundError('HABIT_NOT_FOUND', 'Habit not found')

    if (!Number.isInteger(level) || level < 1 || level > habit.levels.length) {
      throw new ValidationError(
        'INVALID_LEVEL',
        `Invalid level: ${habit.name} has levels from 1 to ${habit.levels.length}`
      )
    }

    if (minutes !== undefined && (!Number.isFinite(minutes) || minutes < 0)) {
      throw new ValidationError('MINUTES_INVALID', 'Minutes must be a non-negative number')
    }

    return this.repository.setEntry(habitId, date, level, minutes)
  }

  async addSession(habitId: string, date: IsoDate, minutes: number): Promise<HabitEntry> {
    if (!ISO_DATE.test(date)) {
      throw new ValidationError('INVALID_DATE', 'Invalid date (use YYYY-MM-DD)')
    }

    const habit = await this.repository.findHabit(habitId)
    if (!habit) throw new NotFoundError('HABIT_NOT_FOUND', 'Habit not found')

    if (!Number.isFinite(minutes) || minutes < 0) {
      throw new ValidationError('MINUTES_INVALID', 'Minutes must be a non-negative number')
    }

    return this.repository.addSession(habitId, date, minutes, (total) =>
      levelFromMinutes(total, habit.levels)
    )
  }

  clearEntry(habitId: string, date: IsoDate): Promise<boolean> {
    return this.repository.clearEntry(habitId, date)
  }
}
