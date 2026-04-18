import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from './features/auth/authSlice'
import AppRoutes from './routes/AppRoutes'
import Spinner from './components/common/Spinner'

function App() {
  const dispatch = useDispatch()
  const { initialized } = useSelector((state) => state.auth)

  // On mount: restore session from cookie
  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  // Show full-page loader until session check completes
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yt-bg">
        <Spinner size="lg" />
      </div>
    )
  }

  return <AppRoutes />
}

export default App
