import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trash2, Clock, Package, Search } from 'lucide-react'
import { SkeletonGrid } from '../../../shared/ui/SkeletonCard'
import type { AppDispatch, RootState } from '../../../store'
import {
  fetchRecentlyViewedThunk,
  removeRecentlyViewedThunk,
  clearRecentlyViewedThunk,
} from '../../../store/recently-viewed/action'

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function RecentlyViewedPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, isLoading } = useSelector((s: RootState) => s.recentlyViewed)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    dispatch(fetchRecentlyViewedThunk())
  }, [dispatch])

  const handleRemove = (productId: string) => {
    dispatch(removeRecentlyViewedThunk(productId))
  }

  const handleClearAll = async () => {
    await dispatch(clearRecentlyViewedThunk())
    setConfirmClear(false)
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          Recently Viewed
        </h2>
        {items.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Clear history
          </button>
        )}
      </div>

      {isLoading ? (
        <SkeletonGrid count={4} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Nothing here yet</h3>
          <p className="mb-4 text-sm text-gray-500">Products you view will appear here.</p>
          <Link to="/products" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Start browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3">
              {/* Thumbnail */}
              <Link
                to={`/products/${item.slug}`}
                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-2xl text-gray-300"
              >
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  : <Package className="h-7 w-7 text-gray-300" />}
              </Link>

              {/* Info */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${item.slug}`}
                    className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-bold text-gray-900">${item.price}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-400">{relativeTime(item.viewedAt)}</p>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(item.productId)}
                aria-label="Remove from history"
                className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Clear confirm dialog */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
            <Trash2 className="mx-auto mb-3 h-10 w-10 text-red-400" />
            <h2 className="mb-2 text-base font-semibold text-gray-900">Clear all history?</h2>
            <p className="mb-5 text-sm text-gray-500">This will remove all {items.length} items from your history.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
