import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pagination } from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import type { Profile } from '../types/api'

interface Filters {
  gender: string
  country_id: string
  age_group: string
  min_age: string
  max_age: string
  sort_by: string
  order: string
}

const defaultFilters: Filters = {
  gender: '',
  country_id: '',
  age_group: '',
  min_age: '',
  max_age: '',
  sort_by: 'created_at',
  order: 'desc',
}

export function ProfilesPage() {
  const { isAdmin } = useAuth()
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newProfileName, setNewProfileName] = useState('')
  const [actionFeedback, setActionFeedback] = useState('')

  const queryParams = useMemo(() => ({ ...filters, page, limit }), [filters, page, limit])

  const loadProfiles = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.getProfiles(queryParams)
      setProfiles(response.data)
      setTotalPages(response.total_pages)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProfiles()
  }, [page, filters])

  const updateFilter = (key: keyof Filters, value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      setActionFeedback('Profile name is required.')
      return
    }

    try {
      await api.createProfile(newProfileName.trim())
      setActionFeedback('Profile created successfully.')
      setNewProfileName('')
      await loadProfiles()
    } catch (requestError) {
      setActionFeedback(requestError instanceof Error ? requestError.message : 'Failed to create profile')
    }
  }

  const handleExport = async () => {
    try {
      const blob = await api.exportProfilesCsv({ ...filters })
      const filename = `profiles_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      anchor.click()
      URL.revokeObjectURL(url)
      setActionFeedback(`CSV exported to ${filename}`)
    } catch (requestError) {
      setActionFeedback(requestError instanceof Error ? requestError.message : 'Export failed')
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Profiles</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Filter, paginate, and export profile intelligence.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
        <input value={filters.gender} onChange={(event) => updateFilter('gender', event.target.value)} placeholder="gender (male/female)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <input value={filters.country_id} onChange={(event) => updateFilter('country_id', event.target.value.toUpperCase())} placeholder="country (NG, US...)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <input value={filters.age_group} onChange={(event) => updateFilter('age_group', event.target.value)} placeholder="age_group" className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <input value={filters.min_age} onChange={(event) => updateFilter('min_age', event.target.value)} placeholder="min_age" className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <input value={filters.max_age} onChange={(event) => updateFilter('max_age', event.target.value)} placeholder="max_age" className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <select value={filters.sort_by} onChange={(event) => updateFilter('sort_by', event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
          <option value="created_at">sort_by: created_at</option>
          <option value="age">sort_by: age</option>
          <option value="gender_probability">sort_by: gender_probability</option>
        </select>
        <select value={filters.order} onChange={(event) => updateFilter('order', event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
          <option value="desc">order: desc</option>
          <option value="asc">order: asc</option>
        </select>
      </div>

      {isAdmin ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-300 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
          <input
            value={newProfileName}
            onChange={(event) => setNewProfileName(event.target.value)}
            placeholder="Create profile by name"
            className="min-w-56 flex-1 rounded-lg border border-cyan-300 px-3 py-2 text-sm dark:border-cyan-800 dark:bg-slate-950"
          />
          <button
            type="button"
            onClick={handleCreateProfile}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Create (admin)
          </button>
        </div>
      ) : null}

      {actionFeedback ? (
        <p className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {actionFeedback}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Gender</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Country</th>
              <th className="px-4 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                  Fetching profiles...
                </td>
              </tr>
            ) : profiles.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                  No profiles found.
                </td>
              </tr>
            ) : (
              profiles.map((profile) => (
                <tr key={profile.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">
                    <Link to={`/profiles/${profile.id}`} className="text-cyan-700 hover:underline dark:text-cyan-300">
                      {profile.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{profile.gender}</td>
                  <td className="px-4 py-3">{profile.age}</td>
                  <td className="px-4 py-3">{profile.country_name} ({profile.country_id})</td>
                  <td className="px-4 py-3">{new Date(profile.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  )
}
