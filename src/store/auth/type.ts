export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: number
  isEmailVerified: boolean
}

export type ModalView = 'login' | 'register' | 'forgot-password'

export interface AuthState {
  user: AuthUser | null
  tokens: AuthTokens | null
  isModalOpen: boolean
  modalView: ModalView
  isLoading: boolean
  error: string | null
  successMessage: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}
