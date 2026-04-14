import { createAsyncThunk } from "@reduxjs/toolkit"
import { httpClient } from "../../core/api/httpClient"
import { extractMessage } from "../../shared/utils/helper"
import type { RecentlyViewedItem } from "./type"


export const fetchRecentlyViewedThunk = createAsyncThunk<RecentlyViewedItem[], void, { rejectValue: string }>('recentlyViewed/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await httpClient.get<RecentlyViewedItem[]>('/users/recently-viewed')
        return data
    }
    catch (err) {
        return rejectWithValue(extractMessage(err, 'Failed to load history'))
    }
})

export const trackProductViewThunk = createAsyncThunk<void, string, { rejectValue: string }>('recentlyViewed/track',
    async (productId, { rejectWithValue }) => {
        try {
            await httpClient.post('/users/recently-viewed', { productId })
        }
        catch (error) {
            return rejectWithValue(extractMessage(error, 'Failed to track view'))
        }
    }
)

export const removeRecentlyViewedThunk = createAsyncThunk<string, string, { rejectValue: string }>(
    'recentlyViewed/remove',
    async (productId, { rejectWithValue }) => {
        try {
            await httpClient.delete(`/users/recently-viewed/${productId}`)
            return productId
        } catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to remove item'))
        }
    }
)

export const clearRecentlyViewedThunk = createAsyncThunk<void, void, { rejectValue: string }>(
    'recentlyViewed/clear',
    async (_, { rejectWithValue }) => {
        try {
            await httpClient.delete('/users/recently-viewed')
        } catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to clear history'))
        }
    }
)
