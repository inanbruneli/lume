import type { Habit, HabitEntry } from '@lume/shared'

export interface UserData {
  habits: Habit[]
  entries: HabitEntry[]
}

export interface UserDataStore {
  read(owner: string): Promise<UserData>
  mutate<T>(owner: string, mutator: (data: UserData) => T | Promise<T>): Promise<T>
}

export function normalizeUserData(value: Partial<UserData> | undefined): UserData {
  return {
    habits: value?.habits ?? [],
    entries: value?.entries ?? []
  }
}
