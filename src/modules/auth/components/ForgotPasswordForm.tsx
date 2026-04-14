import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch'
import { useAppSelector } from '../../../shared/hooks/useAppSelector'
import { clearMessages } from '../../../store/auth/slice'
import { forgotPasswordThunk } from '../../../store/auth/action'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch()
  const { isLoading, error, successMessage } = useAppSelector((s) => s.auth)

  useEffect(() => () => { dispatch(clearMessages()) }, [dispatch])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    dispatch(forgotPasswordThunk(values))
  }

  if (successMessage) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-gray-700">{successMessage}</p>
        <Link to="/login" className="text-xs text-indigo-600 hover:underline">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor="fp-email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="fp-email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.email && (
          <span className="text-xs text-red-600">{errors.email.message}</span>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Sending…' : 'Send reset link'}
      </button>

      <Link to="/login" className="text-center text-xs text-indigo-600 hover:underline">
        Back to login
      </Link>
    </form>
  )
}
