export interface AuthConfig {
  googleClientId: string
  sessionSecret: string
  secureCookies: boolean
}

const MIN_SECRET_LENGTH = 32

export function loadAuthConfig(): AuthConfig {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const sessionSecret = process.env.SESSION_SECRET
  if (!googleClientId) throw new Error('GOOGLE_CLIENT_ID is not set')
  if (!sessionSecret || sessionSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(`SESSION_SECRET must have at least ${MIN_SECRET_LENGTH} characters`)
  }
  return {
    googleClientId,
    sessionSecret,
    secureCookies: process.env.NODE_ENV === 'production'
  }
}
