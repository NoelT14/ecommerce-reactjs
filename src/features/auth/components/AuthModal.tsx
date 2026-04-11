import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { closeModal, clearMessages } from '../../../store/auth/slice'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from './ForgotPasswordForm'

const TITLES: Record<string, string> = {
  login: 'Sign in',
  register: 'Create account',
  'forgot-password': 'Reset password',
}

export default function AuthModal() {
  const dispatch = useAppDispatch()
  const isModalOpen = useAppSelector((s) => s.auth.isModalOpen)
  const modalView = useAppSelector((s) => s.auth.modalView)
  const error = useAppSelector((s) => s.auth.error)
  const successMessage = useAppSelector((s) => s.auth.successMessage)

  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isModalOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeModal())
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isModalOpen, dispatch])

  // Trap focus inside modal
  useEffect(() => {
    if (!isModalOpen) return
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()
  }, [isModalOpen, modalView])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isModalOpen])

  if (!isModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) dispatch(closeModal())
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 id="auth-modal-title" className="text-lg font-semibold text-gray-900">
            {TITLES[modalView]}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => dispatch(closeModal())}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Error banner — only show when there's no success message to avoid overlap */}
        {error && !successMessage && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => dispatch(clearMessages())}
              className="ml-auto shrink-0 text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Active form */}
        {modalView === 'login' && <LoginForm />}
        {modalView === 'register' && <RegisterForm />}
        {modalView === 'forgot-password' && <ForgotPasswordForm />}
      </div>
    </div>
  )
}
