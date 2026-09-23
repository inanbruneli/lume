import express, { type ErrorRequestHandler } from 'express'
import type { AuthConfig } from './config.js'
import { requireAuth } from './auth/requireAuth.js'
import { authRouter } from './routes/auth.js'
import { habitsRouter } from './routes/habits.js'
import { NotFoundError, ValidationError } from './services/habitService.js'

export function createApp(config: AuthConfig) {
  const app = express()

  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api', authRouter(config))
  app.use('/api', requireAuth(config), habitsRouter)

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message, code: err.code })
      return
    }
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message, code: err.code })
      return
    }
    console.error(err)
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal error' })
  }
  app.use(onError)

  return app
}
