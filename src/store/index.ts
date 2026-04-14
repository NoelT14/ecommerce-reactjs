import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/slice'
import addressesReducer from './adress/slice'
import wishlistReducer from './wishlist/slice'
import recentlyViewedReducer from './recently-viewed/slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    addresses: addressesReducer,
    wishlist: wishlistReducer,
    recentlyViewed: recentlyViewedReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
