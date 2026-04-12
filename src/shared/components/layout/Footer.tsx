import { Link } from 'react-router-dom'
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-white">
              <ShoppingBag className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold">Ecommerce</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your one-stop shop for quality products at great prices.
            </p>
            <div className="mt-4 flex gap-3">
              {/* Social placeholders */}
              {['facebook', 'twitter', 'instagram'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-xs text-gray-400 hover:bg-indigo-600 hover:text-white"
                >
                  {s.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Shop
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white">All Products</Link></li>
              <li><Link to="/categories/electronics" className="hover:text-white">Electronics</Link></li>
              <li><Link to="/categories/clothing" className="hover:text-white">Clothing</Link></li>
              <li><Link to="/categories/home-garden" className="hover:text-white">Home & Garden</Link></li>
              <li><Link to="/categories/sports" className="hover:text-white">Sports</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Account
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account/profile" className="hover:text-white">My Profile</Link></li>
              <li><Link to="/account/addresses" className="hover:text-white">Addresses</Link></li>
              <li><Link to="/account/wishlist" className="hover:text-white">Wishlist</Link></li>
              <li><Link to="/account/recently-viewed" className="hover:text-white">Recently Viewed</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-400" />
                123 Commerce St, NY 10001
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-indigo-400" />
                +1 (800) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-indigo-400" />
                support@ecommerce.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ecommerce. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
