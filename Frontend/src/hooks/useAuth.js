import { useSelector, useDispatch } from 'react-redux'
import { loginUser, logoutUser, registerUser } from '../features/auth/authSlice'

/**
 * Convenience hook — wraps auth state + dispatch actions
 * Usage: const { user, isAuthenticated, login, logout } = useAuth()
 */
const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading, error, initialized } = useSelector(
    (state) => state.auth
  )

  const login    = (credentials) => dispatch(loginUser(credentials))
  const logout   = ()            => dispatch(logoutUser())
  const register = (formData)    => dispatch(registerUser(formData))

  return { user, isAuthenticated, loading, error, initialized, login, logout, register }
}

export default useAuth
