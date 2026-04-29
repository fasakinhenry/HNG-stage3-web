import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'

export function AccountPage() {
  const { user } = useAuth()

  const metadata = useMemo(() => ([
    { label: 'Username', value: user ? `@${user.username}` : '-' },
    { label: 'Email', value: user?.email || '-' },
    { label: 'Role', value: user?.role || '-' },
    { label: 'Active', value: user?.is_active ? 'true' : 'false' },
    { label: 'Last login', value: user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : '-' },
    { label: 'Created', value: user?.created_at ? new Date(user.created_at).toLocaleString() : '-' },
  ]), [user])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Session details from the authenticated backend user.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {metadata.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-2 break-all text-sm font-semibold">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
