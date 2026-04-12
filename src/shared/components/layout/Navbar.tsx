import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, LogOut, Settings, Package } from 'lucide-react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { logoutThunk } from '../../../store/auth/action'

const CATEGORIES = [
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Clothing', slug: 'clothing' },
  { label: 'Home & Garden', slug: 'home-garden' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Books', slug: 'books' },
]

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)

  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [catMenuOpen, setCatMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const handleLogout = () => {
    dispatch(logoutThunk())
    setUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      {/* Top bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0 text-xl font-bold text-indigo-600">
          Ecommerce
        </Link>

        {/* Category nav — desktop */}
        <div className="relative hidden md:block">
          <button
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setCatMenuOpen((v) => !v)}
          >
            Categories
            <ChevronDown className="h-4 w-4" />
          </button>
          {catMenuOpen && (
            <div
              className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
              onMouseLeave={() => setCatMenuOpen(false)}
            >
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/categories/${c.slug}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => setCatMenuOpen(false)}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 items-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {/* Wishlist */}
          <Link
            to="/account/wishlist"
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-gray-600 hover:bg-gray-100 md:block"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Cart placeholder */}
          <button
            aria-label="Cart"
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <ShoppingCart className="h-5 w-5" />
            {/* TODO: replace 0 with cart item count from store */}
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              0
            </span>
          </button>

          {/* User menu */}
          {user ? (
            <div className="relative hidden md:block">
              <button
                className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-gray-100"
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium text-gray-700">{user.firstName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                  <Link
                    to="/account/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" /> Profile
                  </Link>
                  <Link
                    to="/account/wishlist"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                  <Link
                    to="/account/recently-viewed"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" /> Recently Viewed
                  </Link>
                  {/* Role 4 = ADMIN */}
                  {user.role >= 4 && (
                    <>
                      <hr className="my-1 border-gray-100" />
                      <Link
                        to="/admin/products"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    </>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 md:hidden">
          <nav className="mt-2 flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/categories/${c.slug}`}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                onClick={() => setMobileOpen(false)}
              >
                {c.label}
              </Link>
            ))}
            <hr className="my-1 border-gray-100" />
            {user ? (
              <>
                <Link to="/account/profile" className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>Profile</Link>
                <Link to="/account/wishlist" className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link to="/register" className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
