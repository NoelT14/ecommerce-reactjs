import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react'
import ProductCard from '../../../shared/ui/ProductCard'
import type { ProductCardData } from '../../../shared/ui/ProductCard'
import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Laptop,
  clothing: Shirt,
  'home-garden': Home,
  sports: Dumbbell,
  books: BookOpen,
  toys: Gamepad2,
}

// ─── Mock data - replace with API calls ──────────────────────────────────────
const MOCK_CATEGORIES = [
  { id: '1', name: 'Electronics', slug: 'electronics', color: 'bg-blue-50 text-blue-700' },
  { id: '2', name: 'Clothing', slug: 'clothing', color: 'bg-pink-50 text-pink-700' },
  { id: '3', name: 'Home', slug: 'home-garden', color: 'bg-green-50 text-green-700' },
  { id: '4', name: 'Sports', slug: 'sports', color: 'bg-orange-50 text-orange-700' },
  { id: '5', name: 'Books', slug: 'books', color: 'bg-purple-50 text-purple-700' },
  { id: '6', name: 'Toys', slug: 'toys', color: 'bg-yellow-50 text-yellow-700' },
]

const MOCK_PRODUCTS: ProductCardData[] = [
  { id: '1', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-headphones', price: '149.99', salePrice: '119.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '2', name: 'Premium Cotton T-Shirt', slug: 'cotton-tshirt', price: '29.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '3', name: 'Ergonomic Office Chair', slug: 'ergonomic-chair', price: '399.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'low_stock' },
  { id: '4', name: 'Running Shoes Pro', slug: 'running-shoes', price: '89.99', salePrice: '69.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '5', name: 'Smart Watch Series X', slug: 'smart-watch', price: '249.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'out_of_stock' },
  { id: '6', name: 'Yoga Mat Premium', slug: 'yoga-mat', price: '45.00', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '7', name: 'Mechanical Keyboard RGB', slug: 'mechanical-keyboard', price: '129.99', salePrice: '99.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '8', name: 'Portable Bluetooth Speaker', slug: 'bluetooth-speaker', price: '59.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
]

const PERKS = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: RotateCcw, title: 'Free Returns', desc: '30-day hassle-free returns' },
  { icon: Shield, title: 'Secure Payments', desc: 'SSL encrypted checkout' },
  { icon: Zap, title: 'Fast Delivery', desc: '2–5 business days' },
]

export default function HomePage() {
  // TODO: fetch categories from GET /categories/tree
  // TODO: fetch featured products from GET /products?status=published&limit=8
  // TODO: fetch recently-viewed if user is authenticated (GET /users/recently-viewed?limit=10)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-indigo-600 to-purple-700 px-4 py-20 text-white lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-200">
            New season arrivals
          </p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
            Shop the Latest<br />
            <span className="text-yellow-300">Trends</span>
          </h1>
          <p className="mb-8 max-w-md text-indigo-100">
            Discover thousands of products at unbeatable prices. From electronics to fashion - we've got it all.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-indigo-700 shadow-md hover:bg-white/20 transition-colors"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/categories/electronics"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:bg-white/20 transition-colors"
            >
              Explore Categories
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 right-32 h-80 w-80 rounded-full bg-white/5" />
      </section>

      {/* Perks Bar */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 lg:grid-cols-4 lg:px-8">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
            All products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {MOCK_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? Laptop

            return (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className={`flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center transition-shadow hover:shadow-md ${cat.color}`}
              >
                <Icon className="h-8 w-8" />
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            // TODO: pass isWishlisted from wishlist state
            // TODO: pass onWishlistToggle handler
            />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-4 mb-12 overflow-hidden rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 px-8 py-10 shadow-md lg:mx-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-amber-900">
              Limited time offer
            </p>
            <h2 className="text-2xl font-extrabold text-white lg:text-3xl">
              Up to 40% off Electronics
            </h2>
            <p className="mt-1 text-amber-100">Sale ends soon - don't miss out!</p>
          </div>
          <Link
            to="/categories/electronics"
            className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-orange-600 shadow hover:bg-orange-50 transition-colors"
          >
            Shop Electronics →
          </Link>
        </div>
      </section>

      {/* Recently viewed placeholder */}
      {/* TODO: only render this section if user is authenticated and has recently-viewed items */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
          <Link to="/account/recently-viewed" className="text-sm font-medium text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        {/* TODO: replace with real recently-viewed products */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {MOCK_PRODUCTS.slice(0, 5).map((p) => (
            <div key={p.id} className="w-40 shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
