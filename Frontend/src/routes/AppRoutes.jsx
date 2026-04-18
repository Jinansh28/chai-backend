import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Spinner from '../components/common/Spinner'

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
const Home       = lazy(() => import('../pages/Home'))
const VideoPage  = lazy(() => import('../pages/VideoPage'))
const Login      = lazy(() => import('../pages/Login'))
const Register   = lazy(() => import('../pages/Register'))
const Upload     = lazy(() => import('../pages/Upload'))
const Profile    = lazy(() => import('../pages/Profile'))
const Search     = lazy(() => import('../pages/Search'))
const History    = lazy(() => import('../pages/History'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="md" />
  </div>
)

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth pages — no layout */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main layout wraps everything else */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/"                   element={<Home />} />
          <Route path="/watch/:videoId"     element={<VideoPage />} />
          <Route path="/search"             element={<Search />} />
          <Route path="/channel/:username"  element={<Profile />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/upload"  element={<Upload />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
