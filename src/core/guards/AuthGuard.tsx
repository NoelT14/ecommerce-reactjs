import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../shared/hooks/useAppSelector'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Redirects to /login if the user is not authenticated.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const user = useAppSelector((selector) => selector.auth.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>

}
