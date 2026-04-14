import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../shared/hooks/useAppSelector'
import { ROLE } from '../../shared/constants/role';

interface AdminGuardProps {
  children: React.ReactNode
}

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

  if (user.role < ROLE.ADMIN) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
