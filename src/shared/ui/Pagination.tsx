import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

interface PaginationProps {
  total: number
  page: number
  pages: number
  limit: number
}

export default function Pagination({ page, pages }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  if (pages <= 1) return null

  const goTo = (p: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  // Build page number window
  const window = 2
  const start = Math.max(1, page - window)
  const end   = Math.min(pages, page + window)
  const pageNumbers: number[] = []
  for (let i = start; i <= end; i++) pageNumbers.push(i)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 py-6">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => goTo(1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-600">1</button>
          {start > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}

      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
            p === page
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {p}
        </button>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span className="px-1 text-gray-400">…</span>}
          <button onClick={() => goTo(pages)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-600">{pages}</button>
        </>
      )}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
