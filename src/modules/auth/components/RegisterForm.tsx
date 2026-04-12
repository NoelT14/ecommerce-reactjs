import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch'
import { useAppSelector } from '../../../shared/hooks/useAppSelector'
import { switchView } from '../../../store/auth/slice'
import { registerThunk, resendVerificationThunk } from '../../../store/auth/action'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function RegisterForm() {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector((s) => s.auth.isLoading)
  const successMessage = useAppSelector((s) => s.auth.successMessage)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (values: FormValues) => {
    dispatch(registerThunk(values))
  }

  // After successful registration show resend button inside the form area
  if (successMessage) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-gray-700">{successMessage}</p>
        <button
          type="button"
          onClick={() => dispatch(resendVerificationThunk())}
          disabled={isLoading}
          className="rounded-lg border border-indigo-600 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
        >
          {isLoading ? 'Sending…' : 'Resend verification email'}
        </button>
        <button
          type="button"
          onClick={() => dispatch(switchView('login'))}
          className="text-xs text-indigo-600 hover:underline"
        >
          Back to login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="reg-first" className="text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            id="reg-first"
            type="text"
            autoComplete="given-name"
            {...register('firstName')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.firstName && (
            <span className="text-xs text-red-600">{errors.firstName.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="reg-last" className="text-sm font-medium text-gray-700">
            Last name
          </label>
          <input
            id="reg-last"
            type="text"
            autoComplete="family-name"
            {...register('lastName')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.lastName && (
            <span className="text-xs text-red-600">{errors.lastName.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.email && (
          <span className="text-xs text-red-600">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.password && (
          <span className="text-xs text-red-600">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>

      <button
        type="button"
        onClick={() => dispatch(switchView('login'))}
        className="text-center text-xs text-indigo-600 hover:underline"
      >
        Already have an account? Sign in
      </button>
    </form>
  )
}
