import { createSlice } from '@reduxjs/toolkit'
import type { AuthState, AuthUser } from './type'
import {
  loginThunk,
  registerThunk,
  forgotPasswordThunk,
  logoutThunk,
  refreshThunk,
  resendVerificationThunk,
  guestTokenThunk,
} from './action'

// Decode JWT payload
function decodeJwtUser(token: string): AuthUser | null {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json)
    // Guard: token must not be expired
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    return {
      id: payload.sub ?? payload.id ?? '',
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
      email: payload.email ?? '',
      role: payload.role ?? 0,
      isEmailVerified: payload.isEmailVerified ?? false,
    }
  } catch {
    return null
  }
}

const storedAccessToken = localStorage.getItem('accessToken')
const storedRefreshToken = localStorage.getItem('refreshToken')
const hydratedUser = storedAccessToken ? decodeJwtUser(storedAccessToken) : null

const initialState: AuthState = {
  user: hydratedUser,
  tokens: storedAccessToken && storedRefreshToken
    ? { accessToken: storedAccessToken, refreshToken: storedRefreshToken }
    : null,
  guestToken: localStorage.getItem('guestToken'),
  isLoading: false,
  error: null,
  successMessage: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null
      state.successMessage = null
    },
    logout(state) {
      state.user = null
      state.tokens = null
      state.error = null
      state.successMessage = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.tokens = action.payload
        state.user = decodeJwtUser(action.payload.accessToken)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? "Login Failed"
      })

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.isLoading = false
        state.successMessage =
          'Account created! Please check your email to verify your account.'
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Something went wrong'
      })

    // Forgot password
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.successMessage = action.payload
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Something went wrong'
      })

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null
      state.tokens = null
    })

    // Refresh
    builder
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.tokens = action.payload
        state.user = decodeJwtUser(action.payload.accessToken)
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.user = null
        state.tokens = null
      })

    // Resend verification
    builder
      .addCase(resendVerificationThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resendVerificationThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.successMessage = action.payload
      })
      .addCase(resendVerificationThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Something went wrong'
      })

    // Guest token
    builder.addCase(guestTokenThunk.fulfilled, (state, action) => {
      state.guestToken = action.payload
    })
  },
})

export const { clearMessages, logout } = authSlice.actions
export default authSlice.reducer
