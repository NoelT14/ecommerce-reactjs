export interface WishlistProduct {
    id: string
    name: string
    slug: string
    price: string
    salePrice: string | null
    saleStartsAt: string | null
    saleEndsAt: string | null
    imageUrl: string | null
    stockStatus: string
}

export interface WishlistItem {
    id: string
    productId: string
    product: WishlistProduct
}

export interface WishlistState {
    items: WishlistItem[]
    isLoading: boolean
    error: string | null
}
