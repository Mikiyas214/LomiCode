import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Wrap any admin-only route with this. Unauthenticated visitors are
 * redirected to /admin/login; the login page can then send them back to
 * where they were trying to go.
 */
export default function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="admin-loading" role="status" aria-live="polite">
        Checking your session…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}
