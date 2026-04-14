import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShoppingBag, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch'
import { resetPasswordThunk } from '../../../store/auth/action'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [showPw, setShowPw] = useState(false)
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    if (!token) return
    setIsLoading(true)
    setSubmitError(null)
    try {
      await dispatch(resetPasswordThunk({ token, password: values.password })).unwrap()
      setDone(true)
    } catch (err) {
      setSubmitError(typeof err === 'string' ? err : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-sm text-red-700">Invalid or missing reset token.</p>
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Password updated!</h2>
          <p className="mb-6 text-sm text-gray-500">You can now sign in with your new password.</p>
          <Link to="/login" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Go to Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex items-center gap-2 text-indigo-600">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">Ecommerce</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Set new password</h1>
          <p className="text-sm text-gray-500">Choose a strong password for your account</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="rp-password" className="text-sm font-medium text-gray-700">
                New password
              </label>
              <div className="relative">
                <input
                  id="rp-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="rp-confirm" className="text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="rp-confirm"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-600">{errors.confirmPassword.message}</span>
              )}
            </div>

            {submitError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Updating…' : 'Set new password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
