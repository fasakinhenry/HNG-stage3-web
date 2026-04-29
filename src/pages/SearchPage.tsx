import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pagination } from '../components/Pagination'
import { api } from '../lib/api'
import type { Profile } from '../types/api'

export function SearchPage() {
  const [query, setQuery] = useState('young males from nigeria')
  const [currentQuery, setCurrentQuery] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async (targetPage = 1) => {
    if (!query.trim()) {
      setError('Enter a natural language query.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await api.searchProfiles(query.trim(), { page: targetPage, limit: 10 })
      setProfiles(response.data)
      setTotalPages(response.total_pages)
      setPage(targetPage)
      setCurrentQuery(query.trim())
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Natural Language Search</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Try queries like <span className="font-semibold">adult females from ghana</span>.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void search(1)
        }}
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-64 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">
          Search
        </button>
      </form>

      {currentQuery ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Showing results for <span className="font-semibold">{currentQuery}</span>
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <p>Searching...</p>
        ) : profiles.length === 0 ? (
          <p className="text-sm text-slate-500">No results yet.</p>
        ) : (
          <ul className="space-y-2">
            {profiles.map((profile) => (
              <li key={profile.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <Link to={`/profiles/${profile.id}`} className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
                  {profile.name}
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {profile.age} years, {profile.gender}, {profile.country_name} ({profile.country_id})
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(nextPage) => void search(nextPage)} />
    </section>
  )
}
