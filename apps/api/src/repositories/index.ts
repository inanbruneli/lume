import { createJsonStore } from '../db/jsonStore.js'
import { createPostgresStore } from '../db/postgresStore.js'
import { JsonHabitRepository } from './JsonHabitRepository.js'
import type { HabitRepository } from './HabitRepository.js'

const databaseUrl = process.env.DATABASE_URL
const store = databaseUrl ? createPostgresStore(databaseUrl) : createJsonStore()

export function habitRepositoryFor(owner: string): HabitRepository {
  return new JsonHabitRepository(store, owner)
}

export type { HabitRepository } from './HabitRepository.js'
