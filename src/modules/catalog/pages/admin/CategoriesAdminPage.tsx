import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import Badge from '../../../../shared/ui/Badge'

interface Category {
  id: string
  name: string
  slug: string
  sortOrder: number
  isActive: boolean
  children: Category[]
}

// ─── Mock tree - replace with GET /categories/tree ────────────────────────────
const MOCK_TREE: Category[] = [
  {
    id: '1', name: 'Electronics', slug: 'electronics', sortOrder: 1, isActive: true, children: [
      { id: '1a', name: 'Headphones & Audio', slug: 'headphones-audio', sortOrder: 1, isActive: true, children: [] },
      { id: '1b', name: 'Computers', slug: 'computers', sortOrder: 2, isActive: true, children: [] },
      { id: '1c', name: 'Wearables', slug: 'wearables', sortOrder: 3, isActive: false, children: [] },
    ]
  },
  {
    id: '2', name: 'Clothing', slug: 'clothing', sortOrder: 2, isActive: true, children: [
      { id: '2a', name: "Men's", slug: 'mens', sortOrder: 1, isActive: true, children: [] },
      { id: '2b', name: "Women's", slug: 'womens', sortOrder: 2, isActive: true, children: [] },
    ]
  },
  { id: '3', name: 'Sports', slug: 'sports', sortOrder: 3, isActive: true, children: [] },
  { id: '4', name: 'Books', slug: 'books', sortOrder: 4, isActive: true, children: [] },
]

const EMPTY_FORM = { name: '', slug: '', description: '', imageUrl: '', parentId: '', sortOrder: 0, isActive: true }

function CategoryRow({ cat, depth = 0, onEdit, onDelete }: {
  cat: Category
  depth?: number
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: depth * 20 }}>
            {cat.children.length > 0 ? (
              <button onClick={() => setExpanded((v) => !v)} className="text-gray-400 hover:text-gray-600">
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <span className="font-medium text-gray-900">{cat.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
        <td className="px-4 py-3 text-gray-600">{cat.sortOrder}</td>
        <td className="px-4 py-3">
          <Badge variant={cat.isActive ? 'green' : 'gray'}>{cat.isActive ? 'Active' : 'Inactive'}</Badge>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => onEdit(cat)} className="rounded p-1 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(cat.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {expanded && cat.children.map((child) => (
        <CategoryRow key={child.id} cat={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </>
  )
}

export default function CategoriesAdminPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (cat: Category) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: '', imageUrl: '', parentId: '', sortOrder: cat.sortOrder, isActive: cat.isActive })
    setModalOpen(true)
  }
  const handleDelete = (id: string) => {
    // TODO: dispatch deleteCategoryThunk(id) - DELETE /categories/:id
    alert(`Delete category ${id} - wire up API call`)
  }
  const handleSave = () => {
    // TODO: dispatch createCategoryThunk / updateCategoryThunk
    console.log(editingId ? 'Update:' : 'Create:', form)
    setModalOpen(false)
  }

  // Auto-fill slug from name
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setForm((f) => ({ ...f, name, slug }))
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key] as string}
        onChange={(e) => {
          if (key === 'name') { handleNameChange(e.target.value); return }
          setForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))
        }}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">Manage product category tree</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_TREE.map((cat) => (
                <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">{editingId ? 'Edit Category' : 'New Category'}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {field('Name', 'name')}
              {field('Slug', 'slug')}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {field('Image URL', 'imageUrl', 'url', 'https://')}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Parent category</label>
                <select value={form.parentId} onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400">
                  <option value="">None (top level)</option>
                  {MOCK_TREE.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {field('Sort order', 'sortOrder', 'number')}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-indigo-600" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
