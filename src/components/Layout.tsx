import { NavLink, useNavigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profiles', label: 'Profiles' },
  { to: '/search', label: 'Search' },
  { to: '/account', label: 'Account' },
]

export function Layout({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#cffafe_0%,#f8fafc_30%,#f8fafc_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,#082f49_0%,#020617_35%,#020617_100%)] dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <NavLink to="/dashboard" className="text-lg font-black tracking-tight text-cyan-700 dark:text-cyan-300">
            Insighta Labs+
          </NavLink>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-700 hover:bg-cyan-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
          <p className="font-semibold">
            @{user?.username}{' '}
            <span className="ml-2 rounded-full bg-cyan-100 px-2 py-0.5 text-xs uppercase tracking-wide text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
              {user?.role}
            </span>
          </p>
        </div>
        {children}
      </main>
    </div>
  )
}
