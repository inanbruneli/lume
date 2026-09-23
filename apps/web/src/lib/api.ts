import type {
  AuthUser,
  CreateHabitInput,
  Habit,
  HabitEntry,
  IsoDate,
  UpdateHabitResult
} from '@lume/shared'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const error = new Error(body?.error ?? `Request failed (${response.status})`) as Error & {
      code?: string
    }
    if (typeof body?.code === 'string') error.code = body.code
    throw error
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  me: () => request<AuthUser>('/api/auth/me'),

  signInWithGoogle: (accessToken: string) =>
    request<AuthUser>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ accessToken })
    }),

  signOut: () => request<void>('/api/auth/logout', { method: 'POST' }),

  listHabits: () => request<Habit[]>('/api/habits'),

  createHabit: (input: CreateHabitInput) =>
    request<Habit>('/api/habits', { method: 'POST', body: JSON.stringify(input) }),

  updateHabit: (id: string, input: CreateHabitInput) =>
    request<UpdateHabitResult>(`/api/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input)
    }),

  deleteHabit: (id: string) => request<void>(`/api/habits/${id}`, { method: 'DELETE' }),

  listEntries: (habitId?: string) =>
    request<HabitEntry[]>(habitId ? `/api/entries?habitId=${habitId}` : '/api/entries'),

  setEntry: (habitId: string, date: IsoDate, level: number, minutes?: number) =>
    request<HabitEntry>(`/api/habits/${habitId}/entries/${date}`, {
      method: 'PUT',
      body: JSON.stringify({ level, minutes })
    }),

  addSession: (habitId: string, date: IsoDate, minutes: number) =>
    request<HabitEntry>(`/api/habits/${habitId}/entries/${date}/sessions`, {
      method: 'POST',
      body: JSON.stringify({ minutes })
    }),

  clearEntry: (habitId: string, date: IsoDate) =>
    request<void>(`/api/habits/${habitId}/entries/${date}`, { method: 'DELETE' })
}
