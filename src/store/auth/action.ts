import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosClient } from '../../api/axiosClient'
import type { AuthTokens, ForgotPasswordPayload, LoginPayload, RegisterPayload } from './type'

function extractMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response &&
    err.response.data &&
    typeof err.response.data === 'object' &&
    'message' in err.response.data
  ) {
    const msg = (err.response.data as { message: unknown }).message
    return typeof msg === 'string' ? msg : fallback
  }
  return fallback
}

export const loginThunk = createAsyncThunk<AuthTokens, LoginPayload>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<AuthTokens>('/auth/login', payload)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Login failed'))
    }
  },
)

export const registerThunk = createAsyncThunk<void, RegisterPayload>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      await axiosClient.post('/auth/register', payload)
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Registration failed'))
    }
  },
)

export const forgotPasswordThunk = createAsyncThunk<string, ForgotPasswordPayload>(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<{ message: string }>('/auth/forgot-password', payload)
      return data.message ?? 'If that email exists, you will receive a reset link shortly.'
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Request failed'))
    }
  },
)

export const logoutThunk = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/auth/logout')
    } catch {
      // Best-effort — always clear local state regardless
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },
)

export const refreshThunk = createAsyncThunk<AuthTokens, string>(
  'auth/refresh',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<AuthTokens>('/auth/refresh', { refreshToken })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Session expired'))
    }
  },
)

export const resendVerificationThunk = createAsyncThunk<string, void>(
  'auth/resendVerification',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<{ message: string }>('/auth/resend-verification')
      return data.message ?? 'Verification email sent.'
    } catch (err) {
      return rejectWithValue(extractMessage(err, 'Failed to resend verification email'))
    }
  },
)
