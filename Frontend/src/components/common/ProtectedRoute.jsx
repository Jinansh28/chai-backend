import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * Redirects unauthenticated users to /login
 * Wraps any protected <Route> groups
 */
const ProtectedRoute = () => {
  const { isAuthenticated, initialized } = useSelector((state) => state.auth)

  if (!initialized) return null // wait for session check

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
