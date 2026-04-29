import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation()
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 dark:bg-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          Loading session...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return children
}
