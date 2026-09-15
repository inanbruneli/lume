import { Router } from 'express'
import type { DateRange } from '@lume/shared'
import { habitRepository } from '../repositories/index.js'
import { HabitService } from '../services/habitService.js'

const service = new HabitService(habitRepository)
export const habitsRouter = Router()

function parseRange(query: Record<string, unknown>): DateRange | undefined {
  const { from, to } = query
  if (typeof from !== 'string' || typeof to !== 'string') return undefined
  return { from, to }
}

habitsRouter.get('/habits', async (_req, res, next) => {
  try {
    res.json(await service.listHabits())
  } catch (err) {
    next(err)
  }
})

habitsRouter.post('/habits', async (req, res, next) => {
  try {
    const { name, levels } = req.body ?? {}
    const habit = await service.createHabit({ name, levels })
    res.status(201).json(habit)
  } catch (err) {
    next(err)
  }
})

habitsRouter.put('/habits/:id', async (req, res, next) => {
  try {
    const { name, levels } = req.body ?? {}
    res.json(await service.updateHabit(req.params.id, { name, levels }))
  } catch (err) {
    next(err)
  }
})

habitsRouter.delete('/habits/:id', async (req, res, next) => {
  try {
    const removed = await service.deleteHabit(req.params.id)
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
    res.json(await service.listEntries(habitId, parseRange(req.query)))
  } catch (err) {
    next(err)
  }
})

habitsRouter.put('/habits/:id/entries/:date', async (req, res, next) => {
  try {
    const { level, minutes } = req.body ?? {}
    const entry = await service.setEntry(
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
    const entry = await service.addSession(req.params.id, req.params.date, Number(minutes))
    res.json(entry)
  } catch (err) {
    next(err)
  }
})

habitsRouter.delete('/habits/:id/entries/:date', async (req, res, next) => {
  try {
    const removed = await service.clearEntry(req.params.id, req.params.date)
    if (!removed) {
      res.status(404).json({ error: 'Entry not found', code: 'ENTRY_NOT_FOUND' })
      return
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})
