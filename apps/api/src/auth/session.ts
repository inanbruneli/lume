import { createHmac, timingSafeEqual } from 'node:crypto'
import type { AuthUser } from '@lume/shared'

export const SESSION_COOKIE = 'lume_session'
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

interface SessionPayload extends AuthUser {
  exp: number
}

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url')
}

export function createSessionToken(user: AuthUser, secret: string): string {
  const payload: SessionPayload = { ...user, exp: Date.now() + SESSION_MAX_AGE_MS }
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${data}.${sign(data, secret)}`
}

export function readSessionToken(token: string, secret: string): AuthUser | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [data, signature] = parts

  const expected = Buffer.from(sign(data, secret))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SessionPayload
    if (typeof payload.email !== 'string' || typeof payload.exp !== 'number') return null
    if (payload.exp < Date.now()) return null
    return { email: payload.email, name: payload.name, picture: payload.picture }
  } catch {
    return null
  }
}

export function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator === -1) continue
    if (part.slice(0, separator).trim() !== name) continue
    try {
      return decodeURIComponent(part.slice(separator + 1).trim())
    } catch {
      return undefined
    }
  }
  return undefined
}
