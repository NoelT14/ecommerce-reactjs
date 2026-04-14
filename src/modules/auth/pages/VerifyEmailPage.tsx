import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingBag, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch'
import { verifyEmailThunk, resendVerificationThunk } from '../../../store/auth/action'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error')
  const [resendSent, setResendSent] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!token) return
    dispatch(verifyEmailThunk({ token }))
      .unwrap()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token, dispatch])

  const handleResend = async () => {
    if (resendLoading) return
    setResendLoading(true)
    try {
      await dispatch(resendVerificationThunk()).unwrap()
      setResendSent(true)
    } catch {
      // keep the button visible so the user can try again
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex items-center gap-2 text-indigo-600">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">Ecommerce</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-600">Verifying your email…</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">Email verified!</h2>
              <p className="text-sm text-gray-500">Your email has been confirmed. You can now sign in.</p>
              <Link
                to="/login"
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Sign in
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <AlertTriangle className="h-14 w-14 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Link invalid or expired</h2>
              <p className="text-sm text-gray-500">
                This verification link has expired or was already used.
              </p>

              {resendSent ? (
                <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                  A new verification email has been sent!
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {resendLoading ? 'Sending…' : 'Resend verification email'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
