import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, AlertCircle, CheckCircle } from 'lucide-react'
import { useAppSelector } from '../../../shared/hooks/useAppSelector'
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch'
import type { UserProfile } from '../../../model/user-model'
import { extractMessage } from '../../../shared/utils/helper'
import { httpClient } from '../../../core/api/httpClient'
import { resendVerificationThunk } from '../../../store/auth/action'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>


export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((selector) => selector.auth.user)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    httpClient.get<UserProfile>('/users').then(({ data }) => {
      setProfile(data)
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl ?? '',
      })
    }).catch((error) => setFetchError(extractMessage(error, 'Failed to load profile')))
  }, [reset])

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const { data } = await httpClient.patch<UserProfile>('/users/profile', values)
      setProfile(data)
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatarUrl: data.avatarUrl ?? '',
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    catch (err) {
      setSaveError(extractMessage(err, 'Failed to save profile'))
    }
    finally {
      setIsSaving(false)
    }
  }

  if (fetchError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {fetchError}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 rounded-full bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200" />
        </div>
      </div>
    )
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
          <button
            className="font-medium underline hover:no-underline"
            onClick={() => dispatch(resendVerificationThunk())}
          >
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

        {saveError && (
          <p className="mt-3 text-sm text-red-600">{saveError}</p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
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
