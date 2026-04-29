interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (nextPage: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
      >
        Previous
      </button>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
      >
        Next
      </button>
    </div>
  )
}
