import { createSelector } from '@reduxjs/toolkit'
import type { HabitEntry, IsoDate } from '@lume/shared'
import type { RootState } from './index.js'

export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthError = (state: RootState) => state.auth.error

export const selectHabits = (state: RootState) => state.habits.habits
export const selectEntries = (state: RootState) => state.habits.entries
export const selectSelectedHabitId = (state: RootState) => state.habits.selectedHabitId
export const selectStatus = (state: RootState) => state.habits.status
export const selectError = (state: RootState) => state.habits.error

export const selectSelectedHabit = createSelector(
  [selectHabits, selectSelectedHabitId],
  (habits, selectedId) => habits.find((habit) => habit.id === selectedId) ?? null
)

export const selectEntriesByDate = createSelector(
  [selectEntries, selectSelectedHabitId],
  (entries, selectedId) => {
    const map: Record<IsoDate, HabitEntry> = {}
    if (!selectedId) return map
    for (const entry of entries) {
      if (entry.habitId === selectedId) map[entry.date] = entry
    }
    return map
  }
)
