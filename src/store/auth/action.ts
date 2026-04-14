import { createAsyncThunk } from '@reduxjs/toolkit'
import { httpClient } from '../../core/api/httpClient'
import type {
  AuthTokens,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  ResetPasswordPayload,
} from './type'
import { extractMessage } from '../../shared/utils/helper'


export const loginThunk = createAsyncThunk<AuthTokens, LoginPayload, { rejectValue: string }>(
  'auth/login', async (payload, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.post<AuthTokens>('/auth/login', payload)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Login failed'))
    }
  }
)

export const registerThunk = createAsyncThunk<void, RegisterPayload, { rejectValue: string }>(
  'auth/register', async (payload, { rejectWithValue }) => {
    try {
      await httpClient.post('/auth/register', payload)
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Registration failed'))
    }
  }
)

export const forgotPasswordThunk = createAsyncThunk<string, ForgotPasswordPayload, { rejectValue: string }>(
  'auth/forgot', async (payload, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.post<{ message: string }>('/auth/forgot-password', payload)
      return data.message ?? 'If that email exists, you will receive a reset link shortly.'
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Request failed'))
    }
  }
)

export const logoutThunk = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    try {
      await httpClient.post('/auth/logout')
    } catch {
      // Best-effort - always clear local state regardless
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },
)

export const refreshThunk = createAsyncThunk<AuthTokens, string, { rejectValue: string }>(
  'auth/refresh',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.post<AuthTokens>('/auth/refresh', { refreshToken })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Session expired'))
    }
  },
)

export const verifyEmailThunk = createAsyncThunk<void, VerifyEmailPayload, { rejectValue: string }>(
  'auth/verifyEmail',
  async ({ token }, { rejectWithValue }) => {
    try {
      await httpClient.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Verification failed. The link may be expired or already used.'))
    }
  },
)

export const resetPasswordThunk = createAsyncThunk<void, ResetPasswordPayload, { rejectValue: string }>(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      await httpClient.post('/auth/reset-password', payload)
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Failed to reset password. The link may be expired.'))
    }
  },
)

export const resendVerificationThunk = createAsyncThunk<string, void, { rejectValue: string }>(
  'auth/resendVerification',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.post<{ message: string }>('/auth/resend-verification')
      return data.message ?? 'Verification email sent.'
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Failed to resend verification email'))
    }
  },
)

export const guestTokenThunk = createAsyncThunk<string, void, { rejectValue: string }>(
  'auth/guestToken',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await httpClient.post<{ guestToken: string }>('/auth/guest-token')
      localStorage.setItem('guestToken', data.guestToken)
      return data.guestToken
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Failed to obtain guest token'))
    }
  }
)
