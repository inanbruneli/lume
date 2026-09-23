import type { RequestHandler } from 'express'
import type { AuthUser } from '@lume/shared'
import type { AuthConfig } from '../config.js'
import { SESSION_COOKIE, readCookie, readSessionToken } from './session.js'

declare global {
  namespace Express {
    interface Locals {
      user: AuthUser
    }
  }
}

export function sessionUser(cookieHeader: string | undefined, config: AuthConfig): AuthUser | null {
  const token = readCookie(cookieHeader, SESSION_COOKIE)
  return token ? readSessionToken(token, config.sessionSecret) : null
}

export function requireAuth(config: AuthConfig): RequestHandler {
  return (req, res, next) => {
    const user = sessionUser(req.headers.cookie, config)
    if (!user) {
      res.status(401).json({ error: 'Sign in required', code: 'UNAUTHORIZED' })
      return
    }
    res.locals.user = user
    next()
  }
}
