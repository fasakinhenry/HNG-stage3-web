import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import type { Profile } from '../types/api'

export function ProfileDetailPage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Missing profile id')
        return
      }

      try {
        const response = await api.getProfile(id)
        setProfile(response.data)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load profile')
      }
    }

    void load()
  }, [id])

  return (
    <section className="space-y-4">
      <Link to="/profiles" className="text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
        Back to profiles
      </Link>
      {error ? (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}
      {!profile && !error ? <p>Loading profile...</p> : null}
      {profile ? (
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
          <h1 className="md:col-span-2 text-3xl font-black">{profile.name}</h1>
          <Detail label="Gender" value={`${profile.gender} (${Math.round(profile.gender_probability * 100)}%)`} />
          <Detail label="Age" value={`${profile.age} (${profile.age_group})`} />
          <Detail label="Country" value={`${profile.country_name} (${profile.country_id})`} />
          <Detail label="Country confidence" value={`${Math.round(profile.country_probability * 100)}%`} />
          <Detail label="Created" value={new Date(profile.created_at).toLocaleString()} />
          <Detail label="ID" value={profile.id} />
        </div>
      ) : null}
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold">{value}</p>
    </article>
  )
}
