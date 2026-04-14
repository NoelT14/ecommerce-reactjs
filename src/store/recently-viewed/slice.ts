import { createSlice } from "@reduxjs/toolkit";
import type { RecentlyViewedState } from "./type";
import { fetchRecentlyViewedThunk, removeRecentlyViewedThunk, clearRecentlyViewedThunk } from "./action";


const initialState: RecentlyViewedState = {
    items: [],
    isLoading: false,
    error: null
}


const recentlyViewedSlice = createSlice({
    name: 'recentlyViewed',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecentlyViewedThunk.pending, (state) => { state.isLoading = true; state.error = null })
            .addCase(fetchRecentlyViewedThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.items = action.payload
            })
            .addCase(fetchRecentlyViewedThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload ?? 'Something went wrong'
            })

        builder.addCase(removeRecentlyViewedThunk.fulfilled, (state, action) => {
            state.items = state.items.filter((i) => i.productId !== action.payload)
        })

        builder.addCase(clearRecentlyViewedThunk.fulfilled, (state) => {
            state.items = []
        })
    },
})

export default recentlyViewedSlice.reducer
