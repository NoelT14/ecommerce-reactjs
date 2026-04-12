import { NavLink, Outlet } from 'react-router-dom'
import { User, MapPin, Heart, Clock } from 'lucide-react'

const NAV = [
  { to: '/account/profile',         label: 'Profile',         icon: User },
  { to: '/account/addresses',       label: 'Addresses',       icon: MapPin },
  { to: '/account/wishlist',        label: 'Wishlist',        icon: Heart },
  { to: '/account/recently-viewed', label: 'Recently Viewed', icon: Clock },
]

export default function AccountLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Account</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <nav className="flex flex-row gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 lg:flex-col">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Page content */}
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
