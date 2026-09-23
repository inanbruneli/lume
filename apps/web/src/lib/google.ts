const GOOGLE_IDENTITY_SRC = 'https://accounts.google.com/gsi/client'
const SCOPES = 'openid email profile'

interface TokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

interface TokenClientError {
  type: string
}

interface TokenClient {
  requestAccessToken: () => void
}

interface TokenClientConfig {
  client_id: string
  scope: string
  callback: (response: TokenResponse) => void
  error_callback: (error: TokenClientError) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient
        }
      }
    }
  }
}

export const POPUP_CLOSED = 'POPUP_CLOSED'

function codedError(code: string, message: string): Error & { code: string } {
  return Object.assign(new Error(message), { code })
}

let loader: Promise<void> | null = null

export function loadGoogleIdentity(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve()
  loader ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GOOGLE_IDENTITY_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      loader = null
      script.remove()
      reject(codedError('GOOGLE_UNAVAILABLE', 'Could not load Google Identity Services'))
    }
    document.head.append(script)
  })
  return loader
}

export async function requestGoogleAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) throw codedError('GOOGLE_UNAVAILABLE', 'VITE_GOOGLE_CLIENT_ID is not set')

  await loadGoogleIdentity()
  const oauth2 = window.google?.accounts.oauth2
  if (!oauth2) throw codedError('GOOGLE_UNAVAILABLE', 'Google Identity Services is unavailable')

  return new Promise((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response) => {
        if (response.access_token) resolve(response.access_token)
        else {
          const message = response.error_description ?? response.error ?? 'No access token'
          reject(codedError('GOOGLE_AUTH_FAILED', message))
        }
      },
      error_callback: (error) => {
        const code = error.type === 'popup_closed' ? POPUP_CLOSED : 'GOOGLE_AUTH_FAILED'
        reject(codedError(code, error.type))
      }
    })
    client.requestAccessToken()
  })
}
