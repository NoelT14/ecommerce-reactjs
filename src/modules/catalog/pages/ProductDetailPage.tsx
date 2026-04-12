import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, ChevronRight, Star, Plus, Minus } from 'lucide-react'
import Badge, { stockBadge } from '../../../shared/ui/Badge'
import { SkeletonText } from '../../../shared/ui/SkeletonCard'

// ─── Mock product — replace with GET /products/:slug ──────────────────────────
const MOCK_PRODUCT = {
  id: '1',
  name: 'Wireless Noise-Cancelling Headphones',
  slug: 'wireless-headphones',
  description: 'Experience premium audio with our top-of-the-line noise-cancelling headphones. Featuring 40-hour battery life, Bluetooth 5.0, and studio-quality sound that blocks out the world around you.\n\nPerfect for commutes, travel, or focused work sessions.',
  price: '149.99',
  salePrice: '119.99',
  saleStartsAt: '2025-01-01T00:00:00Z',
  saleEndsAt: '2027-01-01T00:00:00Z',
  stockQuantity: 23,
  sku: 'WH-NC-001',
  stockStatus: 'in_stock' as const,
  status: 'published',
  isActive: true,
  imageUrl: null,
  images: [
    { id: '1', url: null, altText: 'Front view', isCover: true, sortOrder: 0 },
    { id: '2', url: null, altText: 'Side view', isCover: false, sortOrder: 1 },
    { id: '3', url: null, altText: 'Back view', isCover: false, sortOrder: 2 },
    { id: '4', url: null, altText: 'Folded', isCover: false, sortOrder: 3 },
  ],
  videos: [],
  tags: [
    { id: '1', name: 'Electronics', slug: 'electronics' },
    { id: '2', name: 'Audio', slug: 'audio' },
  ],
  variants: [
    { id: 'v1', sku: 'WH-NC-001-BLK', price: null, stockStatus: 'in_stock', isActive: true, attributeValues: [{ id: 'av1', value: 'Black', attribute: { name: 'Color', type: 'color' } }] },
    { id: 'v2', sku: 'WH-NC-001-WHT', price: null, stockStatus: 'in_stock', isActive: true, attributeValues: [{ id: 'av2', value: 'White', attribute: { name: 'Color', type: 'color' } }] },
    { id: 'v3', sku: 'WH-NC-001-NVY', price: null, stockStatus: 'low_stock', isActive: true, attributeValues: [{ id: 'av3', value: 'Navy', attribute: { name: 'Color', type: 'color' } }] },
  ],
  bulkPrices: [
    { id: 'bp1', minQuantity: 5, price: '129.99' },
    { id: 'bp2', minQuantity: 10, price: '109.99' },
    { id: 'bp3', minQuantity: 20, price: '99.99' },
  ],
}

const MOCK_RELATED = [
  { id: '7', name: 'Mechanical Keyboard RGB', slug: 'mechanical-keyboard', price: '129.99', salePrice: '99.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
  { id: '8', name: 'Portable Bluetooth Speaker', slug: 'bluetooth-speaker', price: '59.99', salePrice: null, saleStartsAt: null, saleEndsAt: null, imageUrl: null, stockStatus: 'in_stock' },
  { id: '10', name: 'USB-C Hub 7-in-1', slug: 'usb-c-hub', price: '49.99', salePrice: '39.99', saleStartsAt: '2025-01-01T00:00:00Z', saleEndsAt: '2027-01-01T00:00:00Z', imageUrl: null, stockStatus: 'in_stock' },
]

function isSaleActive(saleStartsAt: string, saleEndsAt: string) {
  const now = Date.now()
  return now >= new Date(saleStartsAt).getTime() && now <= new Date(saleEndsAt).getTime()
}

const COLOR_MAP: Record<string, string> = {
  Black: 'bg-gray-900',
  White: 'bg-gray-100 border border-gray-300',
  Navy: 'bg-blue-900',
  Red: 'bg-red-600',
  Blue: 'bg-blue-500',
}

export default function ProductDetailPage() {
  useParams<{ slug: string }>()
  const [isLoading] = useState(false) // TODO: set true while fetching

  // TODO: fetch product: httpClient.get(`/products/${slug}`)
  // TODO: if user is authenticated, POST /users/recently-viewed { productId: product.id }
  const product = MOCK_PRODUCT
  const saleActive = isSaleActive(product.saleStartsAt, product.saleEndsAt)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { label, variant: stockVariant } = stockBadge(product.stockStatus)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <SkeletonText lines={1} />
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="skeleton aspect-square w-full rounded-xl" />
          <div className="space-y-4"><SkeletonText lines={6} /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            {product.images[selectedImage]?.url ? (
              <img src={product.images[selectedImage].url!} alt={product.images[selectedImage].altText ?? product.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-8xl text-gray-300">📦</span>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-gray-100 transition-colors ${selectedImage === i ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'}`}
              >
                {img.url ? (
                  <img src={img.url} alt={img.altText ?? ''} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl text-gray-300">📦</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product info*/}
        <div className="flex flex-col gap-5">
          {/* Title + wishlist */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">{product.name}</h1>
            <button
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => {
                setIsWishlisted((v) => !v)
                // TODO: dispatch addToWishlistThunk / removeFromWishlistThunk
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">4.0 (128 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            {saleActive ? (
              <>
                <span className="text-3xl font-bold text-red-600">${product.salePrice}</span>
                <span className="text-lg text-gray-400 line-through">${product.price}</span>
                <Badge variant="red">SALE</Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          {/* Stock + SKU */}
          <div className="flex items-center gap-3">
            <Badge variant={stockVariant}>{label}</Badge>
            <span className="text-xs text-gray-400">SKU: {product.sku}</span>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const colorVal = v.attributeValues[0]?.value ?? ''
                  const colorCls = COLOR_MAP[colorVal] ?? 'bg-gray-300'
                  const { label: vLabel } = stockBadge(v.stockStatus)
                  return (
                    <button
                      key={v.id}
                      title={`${colorVal} — ${vLabel}`}
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={v.stockStatus === 'out_of_stock'}
                      className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selectedVariantId === v.id
                          ? 'border-indigo-600 bg-indigo-50 font-medium text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      <span className={`h-4 w-4 rounded-full ${colorCls}`} />
                      {colorVal}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Quantity</p>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center border-y border-gray-300 text-sm font-semibold">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to cart — placeholder */}
          <button
            disabled={(product.stockStatus as string) === 'out_of_stock'}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {/* TODO: wire up cart functionality */}
            Add to Cart
          </button>

          {/* Description */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-900">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/products?tag=${tag.slug}`}
                  className="rounded-full border border-gray-200 px-3 py-0.5 text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk pricing */}
      {product.bulkPrices.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-lg font-bold text-gray-900">Volume Discounts</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Unit Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">You save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {product.bulkPrices.map((bp) => {
                  const save = (parseFloat(product.price) - parseFloat(bp.price)).toFixed(2)
                  return (
                    <tr key={bp.id} className="hover:bg-indigo-50/40">
                      <td className="px-4 py-3 text-gray-700">{bp.minQuantity}+</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">${bp.price}</td>
                      <td className="px-4 py-3 text-green-600">-${save} per unit</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related products */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-gray-900">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MOCK_RELATED.map((p) => {
            const saleOn = p.saleStartsAt ? isSaleActive(p.saleStartsAt, p.saleEndsAt ?? '') : false
            const { label: sLabel, variant: sVariant } = stockBadge(p.stockStatus)
            return (
              <Link key={p.id} to={`/products/${p.slug}`} className="group overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <div className="flex aspect-square items-center justify-center bg-gray-100 text-5xl text-gray-300">📦</div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-indigo-600">{p.name}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    {saleOn ? (
                      <>
                        <span className="font-bold text-red-600">${p.salePrice}</span>
                        <span className="text-xs text-gray-400 line-through">${p.price}</span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900">${p.price}</span>
                    )}
                  </div>
                  <Badge variant={sVariant} className="mt-1">{sLabel}</Badge>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
