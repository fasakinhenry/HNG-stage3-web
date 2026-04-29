import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

interface DashboardStats {
  totalProfiles: number
  pageSize: number
}

export function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.getProfiles({ page: 1, limit: 1 })
        setStats({
          totalProfiles: response.total,
          pageSize: response.limit,
        })
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard metrics')
      }
    }

    void load()
  }, [])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Unified profile intelligence for analysts and engineers.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total profiles</p>
          <p className="mt-2 text-3xl font-black text-cyan-700 dark:text-cyan-300">
            {stats ? stats.totalProfiles.toLocaleString() : '...'}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500">Signed-in role</p>
          <p className="mt-2 text-3xl font-black capitalize">{user?.role || '-'}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-500">Default page size</p>
          <p className="mt-2 text-3xl font-black">{stats ? stats.pageSize : '-'}</p>
        </article>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}
    </section>
  )
}
