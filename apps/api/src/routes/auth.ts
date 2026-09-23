import { Router, type CookieOptions } from 'express'
import type { AuthConfig } from '../config.js'
import { verifyGoogleAccessToken } from '../auth/google.js'
import { sessionUser } from '../auth/requireAuth.js'
import { SESSION_COOKIE, SESSION_MAX_AGE_MS, createSessionToken } from '../auth/session.js'

export function authRouter(config: AuthConfig) {
  const router = Router()

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.secureCookies,
    path: '/'
  }

  router.post('/auth/google', async (req, res, next) => {
    try {
      const { accessToken } = req.body ?? {}
      const user =
        typeof accessToken === 'string'
          ? await verifyGoogleAccessToken(accessToken, config.googleClientId)
          : null
      if (!user) {
        res.status(401).json({ error: 'Google sign-in failed', code: 'GOOGLE_AUTH_FAILED' })
        return
      }
      res.cookie(SESSION_COOKIE, createSessionToken(user, config.sessionSecret), {
        ...cookieOptions,
        maxAge: SESSION_MAX_AGE_MS
      })
      res.json(user)
    } catch (err) {
      next(err)
    }
  })

  router.get('/auth/me', (req, res) => {
    const user = sessionUser(req.headers.cookie, config)
    if (!user) {
      res.status(401).json({ error: 'Sign in required', code: 'UNAUTHORIZED' })
      return
    }
    res.json(user)
  })

  router.post('/auth/logout', (_req, res) => {
    res.clearCookie(SESSION_COOKIE, cookieOptions)
    res.status(204).end()
  })

  return router
}
