import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import Badge from '../../../../shared/ui/Badge'

type AttributeType = 'text' | 'color' | 'size' | 'number'

interface AttributeValue {
  id: string
  value: string
  sortOrder: number
}

interface Attribute {
  id: string
  name: string
  type: AttributeType
  isActive: boolean
  values: AttributeValue[]
}

// ─── Mock data - replace with GET /attributes ─────────────────────────────────
const MOCK_ATTRS: Attribute[] = [
  {
    id: '1', name: 'Color', type: 'color', isActive: true, values: [
      { id: 'v1', value: 'Black', sortOrder: 1 },
      { id: 'v2', value: 'White', sortOrder: 2 },
      { id: 'v3', value: 'Navy', sortOrder: 3 },
      { id: 'v4', value: 'Red', sortOrder: 4 },
    ]
  },
  {
    id: '2', name: 'Size', type: 'size', isActive: true, values: [
      { id: 'v5', value: 'XS', sortOrder: 1 },
      { id: 'v6', value: 'S', sortOrder: 2 },
      { id: 'v7', value: 'M', sortOrder: 3 },
      { id: 'v8', value: 'L', sortOrder: 4 },
      { id: 'v9', value: 'XL', sortOrder: 5 },
    ]
  },
  {
    id: '3', name: 'Storage', type: 'number', isActive: true, values: [
      { id: 'v10', value: '64GB', sortOrder: 1 },
      { id: 'v11', value: '128GB', sortOrder: 2 },
      { id: 'v12', value: '256GB', sortOrder: 3 },
    ]
  },
  {
    id: '4', name: 'Material', type: 'text', isActive: false, values: [
      { id: 'v13', value: 'Cotton', sortOrder: 1 },
      { id: 'v14', value: 'Polyester', sortOrder: 2 },
    ]
  },
]

const TYPE_LABELS: Record<AttributeType, string> = {
  text: 'Text', color: 'Color', size: 'Size', number: 'Number',
}

const COLOR_PREVIEW: Record<string, string> = {
  Black: 'bg-gray-900', White: 'bg-gray-100 border border-gray-300',
  Navy: 'bg-blue-900', Red: 'bg-red-600', Blue: 'bg-blue-500', Green: 'bg-green-500',
}

function AttributeCard({ attr, onEditAttr, onDeleteAttr }: {
  attr: Attribute
  onEditAttr: (a: Attribute) => void
  onDeleteAttr: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [addValueInput, setAddValueInput] = useState('')

  const handleAddValue = () => {
    if (!addValueInput.trim()) return
    // TODO: POST /attributes/:attributeId/values { value: addValueInput, sortOrder }
    console.log('Add value:', { attributeId: attr.id, value: addValueInput })
    setAddValueInput('')
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setExpanded((v) => !v)} className="text-gray-400 hover:text-gray-600">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{attr.name}</span>
            <Badge variant="blue">{TYPE_LABELS[attr.type]}</Badge>
            <Badge variant={attr.isActive ? 'green' : 'gray'}>{attr.isActive ? 'Active' : 'Inactive'}</Badge>
          </div>
          <p className="text-xs text-gray-400">{attr.values.length} values</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEditAttr(attr)} className="rounded p-1 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDeleteAttr(attr.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {attr.values.map((v) => (
              <div key={v.id} className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm">
                {attr.type === 'color' && (<span className={`h-3 w-3 rounded-full ${COLOR_PREVIEW[v.value] ?? 'bg-gray-300'}`} />)}
                <span>{v.value}</span>
                <button onClick={() => console.log('Delete value:', v.id)} className="hidden text-gray-400 hover:text-red-500 group-hover:block">×</button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {attr.type === 'color' ? (
              <div className="flex items-center gap-2">
                <input type="color" className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5" onChange={(e) => setAddValueInput(e.target.value)} />
                <input type="text" placeholder="Color name (e.g. Navy)" value={addValueInput} onChange={(e) => setAddValueInput(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
            ) : (
              <input type="text" placeholder={`Add ${attr.type === 'number' ? 'number' : 'value'}…`} value={addValueInput} onChange={(e) => setAddValueInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddValue() }} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
            )}
            <button onClick={handleAddValue} className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AttributesAdminPage() {
  const [attrs] = useState<Attribute[]>(MOCK_ATTRS)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'text' as AttributeType, isActive: true })

  const handleDeleteAttr = (id: string) => {
    // TODO: DELETE /attributes/:id
    alert(`Delete attribute ${id}`)
  }

  const handleSave = () => {
    // TODO: POST /attributes
    console.log('Create attribute:', form)
    setModalOpen(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attributes</h1>
          <p className="text-sm text-gray-500">Manage product variant attributes</p>
        </div>
        <button onClick={() => { setForm({ name: '', type: 'text', isActive: true }); setModalOpen(true) }} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Attribute
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {attrs.map((attr) => (
          <AttributeCard
            key={attr.id}
            attr={attr}
            onEditAttr={(a) => { setForm({ name: a.name, type: a.type, isActive: a.isActive }); setModalOpen(true) }}
            onDeleteAttr={handleDeleteAttr}
          />
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">New Attribute</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AttributeType }))} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400">
                  <option value="text">Text</option>
                  <option value="color">Color</option>
                  <option value="size">Size</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-indigo-600" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
