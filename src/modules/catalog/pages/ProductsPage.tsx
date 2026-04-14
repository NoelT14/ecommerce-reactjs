import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../../../shared/ui/ProductCard'
import { SkeletonGrid } from '../../../shared/ui/SkeletonCard'
import Pagination from '../../../shared/ui/Pagination'
import type { ProductCardData } from '../../../shared/ui/ProductCard'

// Mock data - replace with GET /products
const MOCK_PRODUCTS: ProductCardData[] = [
  { id: '1', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-headphones', price: '149.99', salePrice: '119.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '2', name: 'Premium Cotton T-Shirt', slug: 'cotton-tshirt', price: '29.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '3', name: 'Ergonomic Office Chair', slug: 'ergonomic-chair', price: '399.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'low_stock' },
  { id: '4', name: 'Running Shoes Pro', slug: 'running-shoes', price: '89.99', salePrice: '69.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '5', name: 'Smart Watch Series X', slug: 'smart-watch', price: '249.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'out_of_stock' },
  { id: '6', name: 'Yoga Mat Premium', slug: 'yoga-mat', price: '45.00', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '7', name: 'Mechanical Keyboard RGB', slug: 'mechanical-keyboard', price: '129.99', salePrice: '99.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '8', name: 'Portable Bluetooth Speaker', slug: 'bluetooth-speaker', price: '59.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '9', name: 'Leather Wallet', slug: 'leather-wallet', price: '39.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '10', name: 'USB-C Hub 7-in-1', slug: 'usb-c-hub', price: '49.99', salePrice: '39.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '11', name: 'Stainless Steel Water Bottle', slug: 'water-bottle', price: '24.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '12', name: 'Wireless Charging Pad', slug: 'charging-pad', price: '34.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'low_stock' },
]

const CATEGORIES = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Home & Garden' },
  { id: '4', name: 'Sports' },
  { id: '5', name: 'Books' },
]

const STOCK_OPTIONS = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
  { value: 'backorder', label: 'Backorder' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name_asc', label: 'Name A–Z' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const searchQuery = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('category') ?? ''
  const stockStatus = searchParams.get('stock') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'
  const page = Number(searchParams.get('page') ?? '1')

  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (localSearch.trim()) next.set('search', localSearch.trim())
      else next.delete('search')
      next.set('page', '1')
      setSearchParams(next)
    }, 300)
    return () => clearTimeout(t)
  }, [localSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  // Simulate loading - remove when wired to API
  useEffect(() => {
    setIsLoading(true)
    // TODO: dispatch fetchProductsThunk({ page, search: searchQuery, categoryId, stockStatus, sort })
    const t = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(t)
  }, [searchQuery, categoryId, stockStatus, sort, page])

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const clearFilters = () => {
    setLocalSearch('')
    setSearchParams({})
  }

  const hasFilters = !!(searchQuery || categoryId || stockStatus)

  // TODO: replace with data from Redux store (products, total, pages)
  const products = MOCK_PRODUCTS
  const total = MOCK_PRODUCTS.length
  const pages = 3

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
          </h1>
          {!isLoading && (
            <p className="mt-0.5 text-sm text-gray-500">{total} products found</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ─── Filter sidebar ───────────────────────────────────────────── */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} w-full shrink-0 lg:block lg:w-56`}>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => setParam('category', '')}
                  className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${!categoryId ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setParam('category', cat.id)}
                    className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${categoryId === cat.id ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock status */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Availability</label>
              <div className="space-y-1">
                {STOCK_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="stock"
                      value={opt.value}
                      checked={stockStatus === opt.value}
                      onChange={() => setParam('stock', opt.value)}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
                {stockStatus && (
                  <button onClick={() => setParam('stock', '')} className="mt-1 text-xs text-indigo-600 hover:underline">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid  */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <SkeletonGrid count={12} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No products found</h3>
              <p className="mb-4 text-sm text-gray-500">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                  // TODO: isWishlisted from wishlist state
                  // TODO: onWishlistToggle handler
                  />
                ))}
              </div>
              <Pagination total={total} page={page} pages={pages} limit={20} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
