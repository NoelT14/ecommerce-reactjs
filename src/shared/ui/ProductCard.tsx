import { Link } from 'react-router-dom'
import { Heart, Package } from 'lucide-react'
import Badge, { stockBadge } from './Badge'

export interface ProductCardData {
  id: string
  name: string
  slug: string
  price: string
  salePrice: string | null
  saleStartsAt: string | null
  saleEndsAt: string | null
  imageUrl: string | null
  stockStatus: string
}

interface ProductCardProps {
  product: ProductCardData
  isWishlisted?: boolean
  onWishlistToggle?: (productId: string) => void
}

function isSaleActive(salePrice: string | null, saleStartsAt: string | null, saleEndsAt: string | null) {
  if (!salePrice) return false
  const now = Date.now()
  const start = saleStartsAt ? new Date(saleStartsAt).getTime() : 0
  const end   = saleEndsAt   ? new Date(saleEndsAt).getTime()   : Infinity
  return now >= start && now <= end
}

export default function ProductCard({ product, isWishlisted = false, onWishlistToggle }: ProductCardProps) {
  const { id, name, slug, price, salePrice, saleStartsAt, saleEndsAt, imageUrl, stockStatus } = product
  const saleActive = isSaleActive(salePrice, saleStartsAt, saleEndsAt)
  const { label, variant } = stockBadge(stockStatus)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link to={`/products/${slug}`} className="block aspect-square overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><Package className="h-12 w-12 text-gray-300" /></div>
        )}
      </Link>

      {/* Wishlist button */}
      {onWishlistToggle && (
        <button
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => onWishlistToggle(id)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition-colors hover:bg-red-50"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          />
        </button>
      )}

      {/* Sale badge */}
      {saleActive && (
        <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
          SALE
        </span>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to={`/products/${slug}`} className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-indigo-600">
          {name}
        </Link>

        <div className="flex items-baseline gap-2">
          {saleActive ? (
            <>
              <span className="text-base font-bold text-red-600">${salePrice}</span>
              <span className="text-xs text-gray-400 line-through">${price}</span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-900">${price}</span>
          )}
        </div>

        <Badge variant={variant}>{label}</Badge>
      </div>
    </div>
  )
}
