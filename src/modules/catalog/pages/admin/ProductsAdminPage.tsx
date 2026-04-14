import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, Eye, Package } from 'lucide-react'
import Badge, { stockBadge } from '../../../../shared/ui/Badge'
import Pagination from '../../../../shared/ui/Pagination'

// ─── Mock data - replace with GET /products (admin, all statuses) ─────────────
const MOCK_PRODUCTS = [
  { id: '1', name: 'Wireless Noise-Cancelling Headphones', sku: 'WH-NC-001', price: '149.99', salePrice: '119.99', status: 'published', stockStatus: 'in_stock', stockQuantity: 23, categoryName: 'Electronics' },
  { id: '2', name: 'Premium Cotton T-Shirt', sku: 'CT-001', price: '29.99', salePrice: null, status: 'published', stockStatus: 'in_stock', stockQuantity: 150, categoryName: 'Clothing' },
  { id: '3', name: 'Ergonomic Office Chair', sku: 'CH-ERG-01', price: '399.99', salePrice: null, status: 'published', stockStatus: 'low_stock', stockQuantity: 5, categoryName: 'Home' },
  { id: '4', name: 'Running Shoes Pro', sku: 'SH-RUN-01', price: '89.99', salePrice: '69.99', status: 'published', stockStatus: 'in_stock', stockQuantity: 80, categoryName: 'Sports' },
  { id: '5', name: 'Smart Watch Series X', sku: 'SW-X-001', price: '249.99', salePrice: null, status: 'published', stockStatus: 'out_of_stock', stockQuantity: 0, categoryName: 'Electronics' },
  { id: '6', name: 'Yoga Mat Premium', sku: 'YM-PRE-01', price: '45.00', salePrice: null, status: 'draft', stockStatus: 'in_stock', stockQuantity: 60, categoryName: 'Sports' },
  { id: '7', name: 'Mechanical Keyboard RGB', sku: 'KB-RGB-01', price: '129.99', salePrice: '99.99', status: 'published', stockStatus: 'in_stock', stockQuantity: 34, categoryName: 'Electronics' },
  { id: '8', name: 'Portable Bluetooth Speaker', sku: 'SP-BT-001', price: '59.99', salePrice: null, status: 'archived', stockStatus: 'in_stock', stockQuantity: 12, categoryName: 'Electronics' },
]

const STATUS_COLORS: Record<string, 'green' | 'gray' | 'yellow'> = {
  published: 'green',
  draft: 'yellow',
  archived: 'gray',
}

export default function ProductsAdminPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // TODO: replace with Redux state - GET /products with admin params
  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleDelete = (id: string) => {
    // TODO: dispatch deleteProductThunk(id) - DELETE /products/:id
    alert(`Delete product ${id} - wire up API call here`)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{MOCK_PRODUCTS.length} total products</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          {/* TODO: open create product drawer/modal */}
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const { label: sLabel, variant: sVariant } = stockBadge(p.stockStatus)
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"><Package className="h-5 w-5 text-gray-300" /></div>
                        <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        {p.salePrice ? (
                          <>
                            <span className="font-semibold text-red-600">${p.salePrice}</span>
                            <span className="text-xs text-gray-400 line-through">${p.price}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-900">${p.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge variant={sVariant}>{sLabel}</Badge>
                        <span className="text-xs text-gray-400">{p.stockQuantity} units</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_COLORS[p.status] ?? 'gray'}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.categoryName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/products/${p.id}`} target="_blank" rel="noreferrer" className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </a>
                        <button className="rounded p-1 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600" aria-label="Edit">
                          {/* TODO: open edit drawer */}
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">No products match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination total={MOCK_PRODUCTS.length} page={1} pages={2} limit={20} />
    </div>
  )
}
