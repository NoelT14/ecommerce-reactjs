import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppSelector } from '../../../shared/hooks/useAppSelector'
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch'
import { useClearAuthMessages } from '../../../shared/hooks/useClearAuthMessages'
import { loginThunk } from '../../../store/auth/action'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginForm() {
  const dispatch = useAppDispatch()
  const { error, isLoading } = useAppSelector((selector) => selector.auth)

  const navigate = useNavigate()
  useClearAuthMessages()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      await dispatch(loginThunk(values)).unwrap()
      navigate('/')
    }
    catch { }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="login-email"
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
        <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.password && (
          <span className="text-xs text-red-600">{errors.password.message}</span>
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
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="flex justify-between text-xs text-indigo-600">
        <Link to="/register" className="hover:underline">
          Create account
        </Link>
        <Link to="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  )
}
