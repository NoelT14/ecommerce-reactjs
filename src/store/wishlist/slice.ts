import { createSlice } from '@reduxjs/toolkit'
import type { WishlistState } from './type'
import { fetchWishlistThunk, addToWishlistThunk, removeFromWishlistThunk } from './action'


const initialState: WishlistState = {
    items: [],
    isLoading: false,
    error: null,
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlistThunk.pending, (state) => { state.isLoading = true; state.error = null })
            .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.items = action.payload
            })
            .addCase(fetchWishlistThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Something went wrong'
            })

        builder
            .addCase(addToWishlistThunk.fulfilled, (state, action) => {
                state.items.push(action.payload)
            })

        builder
            .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.productId !== action.payload)
            })
    },
})

export default wishlistSlice.reducer
