import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-2 text-sm uppercase tracking-wider text-slate-500">404</p>
        <h1 className="text-2xl font-black">Page not found</h1>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">
          Return home
        </Link>
      </div>
    </div>
  )
}
