import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Badge from '../../../../shared/ui/Badge'

interface Tag {
  id: string
  name: string
  slug: string
  isActive: boolean
  createdAt: string
}

// ─── Mock data — replace with GET /tags ──────────────────────────────────────
const MOCK_TAGS: Tag[] = [
  { id: '1', name: 'Electronics',   slug: 'electronics',   isActive: true,  createdAt: '2024-01-01' },
  { id: '2', name: 'Audio',         slug: 'audio',         isActive: true,  createdAt: '2024-01-02' },
  { id: '3', name: 'New Arrival',   slug: 'new-arrival',   isActive: true,  createdAt: '2024-02-01' },
  { id: '4', name: 'Best Seller',   slug: 'best-seller',   isActive: true,  createdAt: '2024-02-15' },
  { id: '5', name: 'On Sale',       slug: 'on-sale',       isActive: true,  createdAt: '2024-03-01' },
  { id: '6', name: 'Discontinued',  slug: 'discontinued',  isActive: false, createdAt: '2024-01-10' },
]

const EMPTY_FORM = { name: '', slug: '', isActive: true }

export default function TagsAdminPage() {
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (tag: Tag) => { setEditingId(tag.id); setForm({ name: tag.name, slug: tag.slug, isActive: tag.isActive }); setModalOpen(true) }

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setForm((f) => ({ ...f, name, slug }))
  }

  const handleSave = () => {
    if (editingId) {
      setTags((prev) => prev.map((t) => t.id === editingId ? { ...t, ...form } : t))
    } else {
      setTags((prev) => [...prev, { id: `t${Date.now()}`, ...form, createdAt: new Date().toISOString().slice(0, 10) }])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id))
    setDeleteConfirmId(null)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-500">{tags.length} total tags</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Tag
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="search" placeholder="Search tags…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{tag.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">#{tag.slug}</td>
                <td className="px-4 py-3"><Badge variant={tag.isActive ? 'green' : 'gray'}>{tag.isActive ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-4 py-3 text-gray-500">{tag.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(tag)} className="rounded p-1 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteConfirmId(tag.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (<tr><td colSpan={5} className="py-10 text-center text-sm text-gray-400">No tags found</td></tr>)}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">{editingId ? 'Edit Tag' : 'New Tag'}</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
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

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
            <div className="mb-3 text-4xl">🗑️</div>
            <h2 className="mb-2 text-base font-semibold text-gray-900">Delete this tag?</h2>
            <p className="mb-5 text-sm text-gray-500">Products with this tag will lose the association.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
