import { createSlice } from "@reduxjs/toolkit"
import { fetchAddressesThunk, createAddressThunk, updateAddressThunk, deleteAddressThunk, setDefaultAddressThunk } from "./action"
import type { AddressesState } from "./type"

const initialState: AddressesState = {
    addresses: [],
    isLoading: false,
    error: null,
}

const addressesSlice = createSlice({
    name: 'addresses',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null },
    },
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchAddressesThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.addresses = action.payload
            })
            .addCase(fetchAddressesThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Something went wrong'
            })

        // Create
        builder
            .addCase(createAddressThunk.pending, (state) => { state.isLoading = true; state.error = null })
            .addCase(createAddressThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.addresses.push(action.payload)
            })
            .addCase(createAddressThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Something went wrong'
            })

        // Update
        builder
            .addCase(updateAddressThunk.pending, (state) => { state.isLoading = true; state.error = null })
            .addCase(updateAddressThunk.fulfilled, (state, action) => {
                state.isLoading = false
                const idx = state.addresses.findIndex((a) => a.id === action.payload.id)
                if (idx !== -1) state.addresses[idx] = action.payload
            })
            .addCase(updateAddressThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Something went wrong'
            })

        // Delete
        builder
            .addCase(deleteAddressThunk.pending, (state) => { state.isLoading = true; state.error = null })
            .addCase(deleteAddressThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.addresses = state.addresses.filter((a) => a.id !== action.payload)
            })
            .addCase(deleteAddressThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Something went wrong'
            })

        // Set default
        builder
            .addCase(setDefaultAddressThunk.pending, (state) => { state.isLoading = true; state.error = null })
            .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
                state.isLoading = false
                // Server returns the updated address; update all addresses of same type
                state.addresses = state.addresses.map((a) =>
                    a.type === action.payload.type
                        ? { ...a, isDefault: a.id === action.payload.id }
                        : a
                )
            })
            .addCase(setDefaultAddressThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Something went wrong'
            })
    },
})

export const { clearError } = addressesSlice.actions
export default addressesSlice.reducer
