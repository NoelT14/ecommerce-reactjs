import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpClient } from "../../core/api/httpClient";
import { extractMessage } from "../../shared/utils/helper";
import type { Address, CreateAddressPayload, UpdateAddressPayload } from "./type";


export const fetchAddressesThunk = createAsyncThunk<Address[], void, { rejectValue: string }>('address/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await httpClient.get<Address[]>('/users/addresses')
        return data
    }
    catch (err) {
        return rejectWithValue(extractMessage(err, "Failed to load addresses"))
    }
})

export const createAddressThunk = createAsyncThunk<Address, CreateAddressPayload, { rejectValue: string }>('addresses/create',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.post<Address>('users/addresses', payload)
            return data
        }
        catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to create address'))
        }
    })

export const updateAddressThunk = createAsyncThunk<Address, UpdateAddressPayload, { rejectValue: string }>('addresses/update',
    async ({ id, ...payload }, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.patch<Address>(`users/addresses/${id}`, payload)
            return data
        }
        catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to create address'))
        }
    })

export const deleteAddressThunk = createAsyncThunk<string, string, { rejectValue: string }>(
    'addresses/delete',
    async (id, { rejectWithValue }) => {
        try {
            await httpClient.delete(`/users/addresses/${id}`)
            return id
        } catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to delete address'))
        }
    }
)

export const setDefaultAddressThunk = createAsyncThunk<Address, string, { rejectValue: string }>(
    'addresses/setDefault',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await httpClient.patch<Address>(`/users/addresses/${id}/default`)
            return data
        } catch (err) {
            return rejectWithValue(extractMessage(err, 'Failed to set default address'))
        }
    }
)
