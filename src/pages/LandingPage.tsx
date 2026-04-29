import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'

export function LandingPage() {
  const { login, user } = useAuth()

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#e0f2fe_0%,#f8fafc_35%,#fefce8_100%)] px-4 py-8 dark:bg-[linear-gradient(160deg,#0c4a6e_0%,#020617_35%,#172554_100%)]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-cyan-700 dark:text-cyan-300">Insighta Labs+</h1>
          <ThemeToggle />
        </header>

        <section className="grid gap-8 rounded-3xl border border-white/40 bg-white/80 p-8 shadow-xl backdrop-blur md:grid-cols-2 md:p-12 dark:border-slate-800 dark:bg-slate-950/75">
          <div>
            <p className="mb-3 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100">
              Secure Intelligence Platform
            </p>
            <h2 className="mb-4 text-4xl font-black leading-tight text-slate-900 dark:text-white">
              Demographic insights with secure multi-interface access.
            </h2>
            <p className="mb-8 text-slate-600 dark:text-slate-300">
              Browse profile intelligence, run natural-language searches, and export filtered datasets through a role-aware SaaS portal backed by GitHub OAuth sessions.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={login}
                className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-700"
              >
                Continue with GitHub
              </button>
              {user ? (
                <Link
                  to="/dashboard"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Go to dashboard
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3">
            {[
              'HTTP-only cookie sessions with short-lived access windows',
              'Unified backend APIs across web and CLI',
              'Natural language query + advanced filtering and export',
              'Role-enforced controls for admin and analyst users',
            ].map((feature) => (
              <article key={feature} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{feature}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
