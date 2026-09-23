import { createAsyncThunk, createSlice, isRejected } from '@reduxjs/toolkit'
import type { AuthUser } from '@lume/shared'
import { api } from '../lib/api.js'
import { POPUP_CLOSED, requestGoogleAccessToken } from '../lib/google.js'

interface AuthState {
  status: 'checking' | 'signedOut' | 'signingIn' | 'signedIn'
  user: AuthUser | null
  error: { code?: string; message?: string } | null
}

const initialState: AuthState = {
  status: 'checking',
  user: null,
  error: null
}

export const restoreSession = createAsyncThunk('auth/restore', () => api.me())

export const signInWithGoogle = createAsyncThunk('auth/signIn', async () =>
  api.signInWithGoogle(await requestGoogleAccessToken())
)

export const signOut = createAsyncThunk('auth/signOut', () => api.signOut())

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'signedIn'
        state.user = action.payload
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'signedOut'
        state.user = null
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = 'signingIn'
        state.error = null
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = 'signedIn'
        state.user = action.payload
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = 'signedOut'
        const { code, message } = action.error
        state.error = code === POPUP_CLOSED ? null : { code, message }
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'signedOut'
        state.user = null
        state.error = null
      })
      .addMatcher(isRejected, (state, action) => {
        if (action.error.code !== 'UNAUTHORIZED') return
        state.status = 'signedOut'
        state.user = null
      })
  }
})

export default authSlice.reducer
