/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { ICart } from "../interfaces";
import axios from "../lib/axios"
import toast from "react-hot-toast";
export const useCartStore = create<ICart>((set, get) => ({
    cart: [],
    isLoading: false,
    coupon: null,
    total: 0,
    subTotal: 0,
    addToCart: async (product) => {
        set({ isLoading: true })
        try {
            await axios.post('/cart', { productId: product._id });
            set((prevData) => {
                const existingItem = prevData.cart.find(
                    (item) => item._id === product._id
                );

                const newCart = existingItem
                    ? prevData.cart.map((item) => {
                        return item._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item;
                    })
                    : [
                        ...prevData.cart,
                        { ...product, quantity: 1 }
                    ];

                return {
                    cart: newCart,
                };
            });
            get().calculateTotals();
            set({ isLoading: false })
        } catch (error: any) {
            set({ isLoading: false })
            toast.error(error?.message)
            console.log(error);

        }
    },
    getProductCart: async () => {
        set({ isLoading: true })
        try {
            const res = await axios.get('/cart')
            console.log(res);
            set({ cart: res.data, isLoading: false })
            get().calculateTotals();
        } catch (error: any) {
            set({ cart: [], isLoading: false })
            toast.error(error?.message)
            console.log(error);
        }
    },
    calculateTotals: () => {
        const { cart, coupon } = get();
        const subTotal = (cart || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subTotal;
        if (coupon) {
            const discount = subTotal * (coupon.discountPercentage / 100);
            total = subTotal - discount;
        }
        set({ subTotal, total });
    }
}))