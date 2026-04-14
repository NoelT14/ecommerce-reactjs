import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex items-center gap-2 text-indigo-600">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">Ecommerce</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Forgot your password?</h1>
          <p className="text-sm text-gray-500">No worries - we'll send you a reset link</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
