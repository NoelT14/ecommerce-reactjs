import { createAsyncThunk } from '@reduxjs/toolkit'
import { httpClient } from '../../core/api/httpClient'
import { extractMessage } from '../../shared/utils/helper'
import type { WishlistItem } from './type'


export const fetchWishlistThunk = createAsyncThunk<WishlistItem[], void, { rejectValue: string }>(
    'wishlist/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.get<{ data: WishlistItem[] }>('/users/wishlist')
            return data.data
        } catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to load wishlist'))
        }
    }
)

export const addToWishlistThunk = createAsyncThunk<WishlistItem, string, { rejectValue: string }>(
    'wishlist/add',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.post<WishlistItem>('/users/wishlist', { productId })
            return data
        } catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to add to wishlist'))
        }
    }
)

export const removeFromWishlistThunk = createAsyncThunk<string, string, { rejectValue: string }>(
    'wishlist/remove',
    async (productId, { rejectWithValue }) => {
        try {
            await httpClient.delete(`/users/wishlist/${productId}`)
            return productId
        } catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to remove from wishlist'))
        }
    }
)
