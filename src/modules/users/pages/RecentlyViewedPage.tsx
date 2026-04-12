import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Clock } from 'lucide-react'
import Badge, { stockBadge } from '../../../shared/ui/Badge'
import { SkeletonGrid } from '../../../shared/ui/SkeletonCard'

// ─── Mock data — replace with GET /users/recently-viewed?limit=50 ─────────────
const MOCK_VIEWED = [
  { id: 'rv1', productId: '1',  viewedAt: '2026-04-11T10:00:00Z', product: { id: '1',  name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-headphones', price: '149.99', salePrice: '119.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' } },
  { id: 'rv2', productId: '5',  viewedAt: '2026-04-10T15:30:00Z', product: { id: '5',  name: 'Smart Watch Series X',                 slug: 'smart-watch',          price: '249.99', salePrice: null,      saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'out_of_stock' } },
  { id: 'rv3', productId: '8',  viewedAt: '2026-04-10T09:00:00Z', product: { id: '8',  name: 'Portable Bluetooth Speaker',           slug: 'bluetooth-speaker',    price: '59.99',  salePrice: null,      saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' } },
  { id: 'rv4', productId: '3',  viewedAt: '2026-04-09T18:00:00Z', product: { id: '3',  name: 'Ergonomic Office Chair',               slug: 'ergonomic-chair',      price: '399.99', salePrice: null,      saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'low_stock' } },
  { id: 'rv5', productId: '10', viewedAt: '2026-04-09T12:00:00Z', product: { id: '10', name: 'USB-C Hub 7-in-1',                     slug: 'usb-c-hub',            price: '49.99',  salePrice: '39.99',   saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' } },
]

function isSaleActive(salePrice: string | null, saleStartsAt: string | null, saleEndsAt: string | null) {
  if (!salePrice) return false
  const now = Date.now()
  return now >= new Date(saleStartsAt ?? 0).getTime() && now <= new Date(saleEndsAt ?? 0).getTime()
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function RecentlyViewedPage() {
  const [items, setItems] = useState(MOCK_VIEWED)
  const [isLoading] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  // TODO: wire API calls:
  // Remove one: DELETE /users/recently-viewed/:productId
  // Clear all:  DELETE /users/recently-viewed
  const handleRemove = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const handleClearAll = () => {
    setItems([])
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
          <div className="mb-4 text-5xl">🔍</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Nothing here yet</h3>
          <p className="mb-4 text-sm text-gray-500">Products you view will appear here.</p>
          <Link to="/products" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Start browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map(({ id, productId, viewedAt, product }) => {
            const saleOn = isSaleActive(product.salePrice, product.saleStartsAt, product.saleEndsAt)
            const { label, variant } = stockBadge(product.stockStatus)

            return (
              <div key={id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3">
                {/* Thumbnail */}
                <Link to={`/products/${product.slug}`} className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-2xl text-gray-300">
                  {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : '📦'}
                </Link>

                {/* Info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${product.slug}`} className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-indigo-600">
                      {product.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      {saleOn ? (
                        <>
                          <span className="text-sm font-bold text-red-600">${product.salePrice}</span>
                          <span className="text-xs text-gray-400 line-through">${product.price}</span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-gray-900">${product.price}</span>
                      )}
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400">{relativeTime(viewedAt)}</p>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(productId)}
                  aria-label="Remove from history"
                  className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Clear confirm dialog */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
            <div className="mb-3 text-4xl">🗑️</div>
            <h2 className="mb-2 text-base font-semibold text-gray-900">Clear all history?</h2>
            <p className="mb-5 text-sm text-gray-500">This will remove all {items.length} items from your history.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setConfirmClear(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleClearAll} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Clear all</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
