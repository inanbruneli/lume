import { JsonHabitRepository } from './JsonHabitRepository.js'
import type { HabitRepository } from './HabitRepository.js'

export function habitRepositoryFor(owner: string): HabitRepository {
  return new JsonHabitRepository(owner)
}

export type { HabitRepository } from './HabitRepository.js'
