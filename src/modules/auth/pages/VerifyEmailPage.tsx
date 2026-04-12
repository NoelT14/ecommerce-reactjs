import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingBag, Loader2 } from 'lucide-react'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [resendEmail, setResendEmail] = useState('')
  const [resendSent, setResendSent] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    // TODO: call GET /auth/verify-email?token=<token>
    const timer = setTimeout(() => {
      // Simulate success — remove when wired up
      setStatus('success')
    }, 1200)

    return () => clearTimeout(timer)
  }, [token])

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail) return
    // TODO: call POST /auth/resend-verification with { email: resendEmail }
    setResendSent(true)
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
              <div className="text-5xl">✅</div>
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
              <div className="text-5xl">⚠️</div>
              <h2 className="text-lg font-semibold text-gray-900">Link invalid or expired</h2>
              <p className="text-sm text-gray-500">
                This verification link has expired or was already used.
              </p>

              {resendSent ? (
                <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                  A new verification email has been sent!
                </p>
              ) : (
                <form onSubmit={handleResend} className="flex w-full flex-col gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Resend verification email
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
