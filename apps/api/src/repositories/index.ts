import { JsonHabitRepository } from './JsonHabitRepository.js'
import type { HabitRepository } from './HabitRepository.js'

export const habitRepository: HabitRepository = new JsonHabitRepository()

export type { HabitRepository } from './HabitRepository.js'
