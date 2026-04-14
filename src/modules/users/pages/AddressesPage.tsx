import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Star, MapPin, X } from 'lucide-react'
import Badge from '../../../shared/ui/Badge'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../store'
import type { Address, AddressType } from '../../../store/adress/type'
import { createAddressThunk, deleteAddressThunk, fetchAddressesThunk, setDefaultAddressThunk, updateAddressThunk } from '../../../store/adress/action'
import { clearError } from '../../../store/adress/slice'


const EMPTY_FORM: Omit<Address, 'id'> = {
  type: 'shipping', fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', country: '', postalCode: '', isDefault: false,
}

export default function AddressesPage() {

  const dispatch = useDispatch<AppDispatch>()
  const { addresses, isLoading, error } = useSelector((selector: RootState) => selector.addresses)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [form, setForm] = useState<Omit<Address, 'id'>>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAddressesThunk())
  }, [dispatch])

  const openCreate = () => {
    setEditingAddress(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (addr: Address) => {
    setEditingAddress(addr)
    const { type, fullName, phone, addressLine1, addressLine2, city, country, postalCode, isDefault } = addr
    setForm({ type, fullName, phone, addressLine1, addressLine2, city, country, postalCode, isDefault })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (editingAddress) {
      await dispatch(updateAddressThunk({ id: editingAddress.id, ...form }))
    }
    else {
      await dispatch(createAddressThunk(form));
    }
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await dispatch(deleteAddressThunk(id))
    setDeleteConfirmId(null)
  }

  const handleSetDefault = (id: string) => {
    dispatch(setDefaultAddressThunk(id))
  }

  const shipping = addresses.filter((a) => a.type === 'shipping')
  const billing = addresses.filter((a) => a.type === 'billing')


  const AddressCard = ({ addr }: { addr: Address }) => (
    <div className={`relative rounded-xl border bg-white p-4 ${addr.isDefault ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200'}`}>
      {addr.isDefault && (
        <Badge variant="purple" className="absolute right-3 top-3">
          <Star className="mr-1 h-3 w-3" /> Default
        </Badge>
      )}
      <div className="flex items-start gap-2 pr-20">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <div>
          <p className="font-semibold text-gray-900">{addr.fullName}</p>
          <p className="text-sm text-gray-600">{addr.phone}</p>
          <p className="text-sm text-gray-600">{addr.addressLine1}</p>
          {addr.addressLine2 && <p className="text-sm text-gray-600">{addr.addressLine2}</p>}
          <p className="text-sm text-gray-600">{addr.city}, {addr.postalCode}</p>
          <p className="text-sm text-gray-600">{addr.country}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
        {!addr.isDefault && (
          <button
            onClick={() => handleSetDefault(addr.id)}
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            Set as default
          </button>
        )}
        <button
          onClick={() => openEdit(addr)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
        <button
          onClick={() => setDeleteConfirmId(addr.id)}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" /> Delete
        </button>
      </div>
    </div>
  )

  const field = (label: string, key: keyof Omit<Address, 'id'>, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={(form[key] as string) ?? ''}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  )

  if (isLoading && addresses.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())} className="shrink-0 text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Address Book</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {/* Shipping */}
      <section className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Shipping</h3>
        {shipping.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">No shipping addresses yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {shipping.map((a) => <AddressCard key={a.id} addr={a} />)}
          </div>
        )}
      </section>

      {/* Billing */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Billing</h3>
        {billing.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">No billing addresses yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {billing.map((a) => <AddressCard key={a.id} addr={a} />)}
          </div>
        )}
      </section>

      {/* Add/Edit Modal  */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              {editingAddress ? 'Edit Address' : 'Add Address'}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AddressType }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                >
                  <option value="shipping">Shipping</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
              {field('Full name', 'fullName')}
              {field('Phone', 'phone', 'tel')}
              {field('Address line 1', 'addressLine1')}
              {field('Address line 2 (optional)', 'addressLine2')}
              {field('City', 'city')}
              {field('Country', 'country')}
              {field('Postal code', 'postalCode')}
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-gray-700">Set as default</span>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
            <Trash2 className="mb-3 h-10 w-10 text-red-400" />
            <h2 className="mb-2 text-base font-semibold text-gray-900">Delete this address?</h2>
            <p className="mb-5 text-sm text-gray-500">This action cannot be undone.</p>
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
