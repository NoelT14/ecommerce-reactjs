import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, AlertCircle, CheckCircle } from 'lucide-react'
import { useAppSelector } from '../../../shared/hooks/useAppSelector'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  phone:     z.string().nullable().optional(),
  avatarUrl: z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

// ─── Mock profile — replace with GET /users ───────────────────────────────────
const MOCK_PROFILE = {
  id: 'uuid-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 555-0100',
  avatarUrl: null,
  role: 1,
  isEmailVerified: true,
  createdAt: '2024-03-15T10:00:00Z',
}

export default function ProfilePage() {
  const authUser = useAppSelector((s) => s.auth.user)
  // TODO: fetch full profile via GET /users and store in a profileSlice
  const profile = MOCK_PROFILE
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile.firstName,
      lastName:  profile.lastName,
      phone:     profile.phone,
      avatarUrl: profile.avatarUrl ?? '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    // TODO: dispatch updateProfileThunk(values) — PATCH /users/profile
    console.log('Update profile:', values)
    await new Promise((r) => setTimeout(r, 600))
    setIsLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 p-6">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <button
            aria-label="Change avatar"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-gray-600 hover:bg-indigo-100"
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-xs text-gray-400">
            Member since {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Unverified email banner */}
      {authUser && !authUser.isEmailVerified && (
        <div className="flex items-center gap-2 bg-yellow-50 px-6 py-3 text-sm text-yellow-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Your email is not verified.{' '}
          <button className="font-medium underline hover:no-underline">
            Resend verification email
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <h2 className="mb-5 text-sm font-semibold text-gray-900">Personal Information</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="p-first" className="text-sm font-medium text-gray-700">First name</label>
            <input
              id="p-first"
              type="text"
              {...register('firstName')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.firstName && <span className="text-xs text-red-600">{errors.firstName.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="p-last" className="text-sm font-medium text-gray-700">Last name</label>
            <input
              id="p-last"
              type="text"
              {...register('lastName')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.lastName && <span className="text-xs text-red-600">{errors.lastName.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="p-email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="p-email"
              type="email"
              value={profile.email}
              disabled
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
            <span className="text-xs text-gray-400">Email cannot be changed here</span>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="p-phone" className="text-sm font-medium text-gray-700">Phone</label>
            <input
              id="p-phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 555-0100"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="p-avatar" className="text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              id="p-avatar"
              type="url"
              {...register('avatarUrl')}
              placeholder="https://example.com/photo.jpg"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.avatarUrl && <span className="text-xs text-red-600">{errors.avatarUrl.message}</span>}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={!isDirty || isLoading}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving…' : 'Save changes'}
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" /> Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
