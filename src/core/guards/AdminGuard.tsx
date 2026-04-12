import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../shared/hooks/useAppSelector'

interface AdminGuardProps {
  children: React.ReactNode
}

const ADMIN_ROLE = 4

/**
 * Allows access only to users with role >= ADMIN (4).
 * Redirects authenticated non-admins to /403.
 * Redirects unauthenticated users to /login.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const user = useAppSelector((selector) => selector.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role < ADMIN_ROLE) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
