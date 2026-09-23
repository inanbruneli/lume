import type { AuthUser } from '@lume/shared'

const TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo'
const USER_INFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

interface TokenInfo {
  aud?: string
  email?: string
  email_verified?: string | boolean
}

interface UserInfo {
  name?: string
  picture?: string
}

export async function verifyGoogleAccessToken(
  accessToken: string,
  clientId: string
): Promise<AuthUser | null> {
  const tokenResponse = await fetch(
    `${TOKEN_INFO_URL}?access_token=${encodeURIComponent(accessToken)}`
  )
  if (!tokenResponse.ok) return null

  const token = (await tokenResponse.json()) as TokenInfo
  if (token.aud !== clientId) return null
  if (!token.email || String(token.email_verified) !== 'true') return null

  const profileResponse = await fetch(USER_INFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  const profile = profileResponse.ok ? ((await profileResponse.json()) as UserInfo) : {}

  return {
    email: token.email.toLowerCase(),
    name: profile.name,
    picture: profile.picture
  }
}
