import { useEffect, useState } from 'react'
import { applyTheme, getPreferredTheme, type ThemeMode } from '../lib/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
      <span className="h-2 w-2 rounded-full bg-cyan-500" aria-hidden />
    </button>
  )
}
