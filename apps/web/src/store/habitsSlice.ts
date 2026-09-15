import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CreateHabitInput, Habit, HabitEntry, IsoDate } from '@lume/shared'
import { api } from '../lib/api.js'

interface HabitsState {
  habits: Habit[]
  entries: HabitEntry[]
  selectedHabitId: string | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
}

const initialState: HabitsState = {
  habits: [],
  entries: [],
  selectedHabitId: null,
  status: 'idle',
  error: null
}

export const loadData = createAsyncThunk('habits/load', async () => {
  const [habits, entries] = await Promise.all([api.listHabits(), api.listEntries()])
  return { habits, entries }
})

export const createHabit = createAsyncThunk(
  'habits/create',
  async (input: CreateHabitInput) => api.createHabit(input)
)

export const updateHabit = createAsyncThunk(
  'habits/update',
  async (payload: { id: string; input: CreateHabitInput }) =>
    api.updateHabit(payload.id, payload.input)
)

export const deleteHabit = createAsyncThunk('habits/delete', async (id: string) => {
  await api.deleteHabit(id)
  return id
})

export const setEntry = createAsyncThunk(
  'habits/setEntry',
  async (payload: { habitId: string; date: IsoDate; level: number; minutes?: number }) =>
    api.setEntry(payload.habitId, payload.date, payload.level, payload.minutes)
)

export const addSession = createAsyncThunk(
  'habits/addSession',
  async (payload: { habitId: string; date: IsoDate; minutes: number }) =>
    api.addSession(payload.habitId, payload.date, payload.minutes)
)

export const clearEntry = createAsyncThunk(
  'habits/clearEntry',
  async (payload: { habitId: string; date: IsoDate }) => {
    await api.clearEntry(payload.habitId, payload.date)
    return payload
  }
)

function upsertEntry(state: HabitsState, entry: HabitEntry) {
  const existing = state.entries.find(
    (item) => item.habitId === entry.habitId && item.date === entry.date
  )
  if (existing) {
    existing.level = entry.level
    existing.minutes = entry.minutes
  } else state.entries.push(entry)
}

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    habitSelected(state, action: PayloadAction<string | null>) {
      state.selectedHabitId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadData.fulfilled, (state, action) => {
        state.habits = action.payload.habits
        state.entries = action.payload.entries
        state.status = 'ready'
        const stillExists = state.habits.some((habit) => habit.id === state.selectedHabitId)
        if (!stillExists) state.selectedHabitId = state.habits[0]?.id ?? null
      })
      .addCase(loadData.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? null
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.push(action.payload)
        state.selectedHabitId = action.payload.id
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        const { habit, entries } = action.payload
        const index = state.habits.findIndex((item) => item.id === habit.id)
        if (index !== -1) state.habits[index] = habit
        state.entries = state.entries
          .filter((entry) => entry.habitId !== habit.id)
          .concat(entries)
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter((habit) => habit.id !== action.payload)
        state.entries = state.entries.filter((entry) => entry.habitId !== action.payload)
        if (state.selectedHabitId === action.payload) {
          state.selectedHabitId = state.habits[0]?.id ?? null
        }
      })
      .addCase(setEntry.fulfilled, (state, action) => {
        upsertEntry(state, action.payload)
      })
      .addCase(addSession.fulfilled, (state, action) => {
        upsertEntry(state, action.payload)
      })
      .addCase(clearEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(
          (entry) =>
            !(entry.habitId === action.payload.habitId && entry.date === action.payload.date)
        )
      })
  }
})

export const { habitSelected } = habitsSlice.actions
export default habitsSlice.reducer
