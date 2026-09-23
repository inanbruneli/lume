import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import habitsReducer from './habitsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
