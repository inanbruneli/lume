import { Router, type Response } from 'express'
import type { DateRange } from '@lume/shared'
import { habitRepositoryFor } from '../repositories/index.js'
import { HabitService } from '../services/habitService.js'

export const habitsRouter = Router()

function serviceFor(res: Response): HabitService {
  return new HabitService(habitRepositoryFor(res.locals.user.email))
}

function parseRange(query: Record<string, unknown>): DateRange | undefined {
  const { from, to } = query
  if (typeof from !== 'string' || typeof to !== 'string') return undefined
  return { from, to }
}

habitsRouter.get('/habits', async (_req, res, next) => {
  try {
    res.json(await serviceFor(res).listHabits())
  } catch (err) {
    next(err)
  }
})

habitsRouter.post('/habits', async (req, res, next) => {
  try {
    const { name, levels } = req.body ?? {}
    const habit = await serviceFor(res).createHabit({ name, levels })
    res.status(201).json(habit)
  } catch (err) {
    next(err)
  }
})

habitsRouter.put('/habits/:id', async (req, res, next) => {
  try {
    const { name, levels } = req.body ?? {}
    res.json(await serviceFor(res).updateHabit(req.params.id, { name, levels }))
  } catch (err) {
    next(err)
  }
})

habitsRouter.delete('/habits/:id', async (req, res, next) => {
  try {
    const removed = await serviceFor(res).deleteHabit(req.params.id)
    if (!removed) {
      res.status(404).json({ error: 'Habit not found', code: 'HABIT_NOT_FOUND' })
      return
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

habitsRouter.get('/entries', async (req, res, next) => {
  try {
    const habitId = typeof req.query.habitId === 'string' ? req.query.habitId : undefined
    res.json(await serviceFor(res).listEntries(habitId, parseRange(req.query)))
  } catch (err) {
    next(err)
  }
})

habitsRouter.put('/habits/:id/entries/:date', async (req, res, next) => {
  try {
    const { level, minutes } = req.body ?? {}
    const entry = await serviceFor(res).setEntry(
      req.params.id,
      req.params.date,
      Number(level),
      minutes === undefined || minutes === null ? undefined : Number(minutes)
    )
    res.json(entry)
  } catch (err) {
    next(err)
  }
})

habitsRouter.post('/habits/:id/entries/:date/sessions', async (req, res, next) => {
  try {
    const { minutes } = req.body ?? {}
    const entry = await serviceFor(res).addSession(
      req.params.id,
      req.params.date,
      Number(minutes)
    )
    res.json(entry)
  } catch (err) {
    next(err)
  }
})

habitsRouter.delete('/habits/:id/entries/:date', async (req, res, next) => {
  try {
    const removed = await serviceFor(res).clearEntry(req.params.id, req.params.date)
    if (!removed) {
      res.status(404).json({ error: 'Entry not found', code: 'ENTRY_NOT_FOUND' })
      return
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})
