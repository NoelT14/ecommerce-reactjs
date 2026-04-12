import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingCart } from 'lucide-react'
import Badge, { stockBadge } from '../../../shared/ui/Badge'
import Pagination from '../../../shared/ui/Pagination'
import { SkeletonGrid } from '../../../shared/ui/SkeletonCard'

// ─── Mock data — replace with GET /users/wishlist ─────────────────────────────
const MOCK_WISHLIST = [
  { id: 'w1', productId: '1', product: { id: '1', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-headphones', price: '149.99', salePrice: '119.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' } },
  { id: 'w2', productId: '3', product: { id: '3', name: 'Ergonomic Office Chair',               slug: 'ergonomic-chair',      price: '399.99', salePrice: null,      saleStartsAt: null,                  saleEndsAt: null,                    imageUrl: null, stockStatus: 'low_stock' } },
  { id: 'w3', productId: '7', product: { id: '7', name: 'Mechanical Keyboard RGB',              slug: 'mechanical-keyboard',  price: '129.99', salePrice: '99.99',   saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' } },
  { id: 'w4', productId: '5', product: { id: '5', name: 'Smart Watch Series X',                 slug: 'smart-watch',          price: '249.99', salePrice: null,      saleStartsAt: null,                  saleEndsAt: null,                    imageUrl: null, stockStatus: 'out_of_stock' } },
]

function isSaleActive(salePrice: string | null, saleStartsAt: string | null, saleEndsAt: string | null) {
  if (!salePrice) return false
  const now = Date.now()
  return now >= new Date(saleStartsAt ?? 0).getTime() && now <= new Date(saleEndsAt ?? 0).getTime()
}

export default function WishlistPage() {
  const [items, setItems] = useState(MOCK_WISHLIST)
  const [isLoading] = useState(false) // TODO: set true while fetching

  // TODO: replace local operations with API calls:
  // Remove: DELETE /users/wishlist/:productId
  const handleRemove = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          My Wishlist{' '}
          <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-sm font-semibold text-indigo-700">
            {items.length}
          </span>
        </h2>
      </div>

      {isLoading ? (
        <SkeletonGrid count={4} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-5xl">💝</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Your wishlist is empty</h3>
          <p className="mb-4 text-sm text-gray-500">Save products you love and come back to them anytime.</p>
          <Link
            to="/products"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map(({ id, productId, product }) => {
            const saleOn = isSaleActive(product.salePrice, product.saleStartsAt, product.saleEndsAt)
            const { label, variant } = stockBadge(product.stockStatus)

            return (
              <div key={id} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
                {/* Thumbnail */}
                <Link to={`/products/${product.slug}`} className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-3xl text-gray-300 hover:opacity-80">
                  {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : '📦'}
                </Link>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Link to={`/products/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-indigo-600">
                    {product.name}
                  </Link>

                  <div className="flex items-baseline gap-2">
                    {saleOn ? (
                      <>
                        <span className="font-bold text-red-600">${product.salePrice}</span>
                        <span className="text-xs text-gray-400 line-through">${product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900">${product.price}</span>
                    )}
                  </div>

                  <Badge variant={variant}>{label}</Badge>

                  <div className="mt-auto flex items-center gap-2">
                    <button
                      disabled={product.stockStatus === 'out_of_stock'}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      {/* TODO: wire cart */}
                      <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(productId)}
                      aria-label="Remove from wishlist"
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-red-500 hover:border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {items.length > 0 && (
        <Pagination total={items.length} page={1} pages={1} limit={20} />
      )}
    </div>
  )
}
