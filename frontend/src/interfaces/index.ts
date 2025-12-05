export type ISignup = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string

}
export type ILogin = {
    email: string,
    password: string
}
export interface IUser {
    id: string
    name: string
    email: string
    role?: string
}

export interface IUserStore {
    user: IUser | null
    isLoading: boolean
    checkingAuth: boolean
    signup: (data: ISignup) => Promise<void>
    login: (data: ILogin) => Promise<void>
    checkAuth: () => Promise<void>
    logout: () => Promise<void>
}
export interface IProduct {
    _id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    image: string,
    quantity: number,
    isFeatured?: boolean,
}
export interface IProductStore {
    products: IProduct[],
    isLoading: boolean,
    setProduct: (product: IProduct[]) => void; // ✅ add this line
    fetchAllProducts: () => Promise<void>
    createProduct: (product: IProduct) => Promise<void>
    deleteProduct: (id: string) => Promise<void>
    toggleFeaturedProduct: (id: string) => Promise<void>
    fetchProductByCategory: (category: string) => Promise<void>
}
export interface ICoupon {
    code: string
    discountPercentage: number
  
}
export interface ICart {
    cart: IProduct[],
    isLoading: boolean,
    total: number,
    subtotal: number,
    coupon: null | ICoupon
    isCouponApplied: boolean,
    getProductCart: () => Promise<void>
    addToCart: (product: IProduct) => void,
    calculateTotals: () => void
    removeFromCart: (productId: string) => Promise<void>
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => Promise<void>
    getMyCoupons: () => Promise<void>
    applyCoupon: (code: string) => Promise<void>
    removeCoupon: () => Promise<void>
}