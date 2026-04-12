import { NavLink, Outlet, Link } from 'react-router-dom'
import { Package, Tag, Layers, Sliders, ChevronLeft } from 'lucide-react'

const NAV = [
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/tags', label: 'Tags', icon: Tag },
  { to: '/admin/attributes', label: 'Attributes', icon: Sliders },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Admin sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-gray-900 lg:block">
        <div className="flex h-16 items-center gap-2 px-5 text-white">
          <Sliders className="h-5 w-5 text-indigo-400" />
          <span className="font-bold">Admin Panel</span>
        </div>
        <nav className="mt-2 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 w-54">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" /> Back to store
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Mobile top nav */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-xs font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
