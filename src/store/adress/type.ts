
export type AddressType = 'billing' | 'shipping'
export interface Address {
    id: string;
    type: AddressType;
    fullName: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    city: string
    country: string
    postalCode: string
    isDefault: boolean
}

export interface AddressesState {
    addresses: Address[]
    isLoading: boolean
    error: string | null
}

export type CreateAddressPayload = Omit<Address, 'id'>

export interface UpdateAddressPayload extends Partial<Omit<Address, 'id'>> {
    id: string;//id required again
}
