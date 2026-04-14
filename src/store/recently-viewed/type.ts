export interface RecentlyViewedItem {
    productId: string
    name: string
    slug: string
    imageUrl: string | null
    price: string
    viewedAt: string
}

export interface RecentlyViewedState {
    items: RecentlyViewedItem[]
    isLoading: boolean
    error: string | null
}
