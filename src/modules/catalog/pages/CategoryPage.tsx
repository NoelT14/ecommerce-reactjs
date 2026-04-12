import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import ProductCard from '../../../shared/ui/ProductCard'
import { SkeletonGrid } from '../../../shared/ui/SkeletonCard'
import Pagination from '../../../shared/ui/Pagination'
import type { ProductCardData } from '../../../shared/ui/ProductCard'

// ─── Mock data — replace with GET /categories/:slug and GET /products?categoryId ──
const MOCK_PRODUCTS: ProductCardData[] = [
  { id: '1', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-headphones', price: '149.99', salePrice: '119.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '7', name: 'Mechanical Keyboard RGB',              slug: 'mechanical-keyboard',  price: '129.99', salePrice: '99.99',  saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '8', name: 'Portable Bluetooth Speaker',           slug: 'bluetooth-speaker',    price: '59.99',  salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '5', name: 'Smart Watch Series X',                 slug: 'smart-watch',          price: '249.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'out_of_stock' },
  { id: '10', name: 'USB-C Hub 7-in-1',                    slug: 'usb-c-hub',            price: '49.99',  salePrice: '39.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '12', name: 'Wireless Charging Pad',               slug: 'charging-pad',         price: '34.99',  salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'low_stock' },
]

// Mock sub-categories for sidebar
const MOCK_SUBCATEGORIES = [
  { id: '1a', name: 'Headphones & Audio', slug: 'headphones-audio' },
  { id: '1b', name: 'Computers',          slug: 'computers' },
  { id: '1c', name: 'Wearables',          slug: 'wearables' },
  { id: '1d', name: 'Accessories',        slug: 'accessories' },
]

const SLUG_TO_LABEL: Record<string, string> = {
  electronics: 'Electronics',
  clothing:    'Clothing',
  'home-garden': 'Home & Garden',
  sports:      'Sports',
  books:       'Books',
  toys:        'Toys',
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const categoryName = SLUG_TO_LABEL[slug ?? ''] ?? slug ?? 'Category'

  // TODO: fetch category from GET /categories/:slug (or by slug matching tree)
  // TODO: fetch products from GET /products?categoryId=<id>
  const isLoading = false
  const products = MOCK_PRODUCTS
  const total = MOCK_PRODUCTS.length
  const page = 1
  const pages = 2

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{categoryName}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-10 text-white">
        <h1 className="text-3xl font-extrabold">{categoryName}</h1>
        <p className="mt-2 text-indigo-100">
          {total} products in this category
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sub-category sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Sub-categories
            </h2>
            <nav className="space-y-1">
              <Link
                to={`/categories/${slug}`}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50"
              >
                All {categoryName}
              </Link>
              {MOCK_SUBCATEGORIES.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/categories/${sub.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  {sub.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Products */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
