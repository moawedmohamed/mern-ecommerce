/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { IProduct, IProductStore } from "../interfaces";
import axios from "../lib/axios";
import toast from "react-hot-toast";
// import { type } from './../interfaces/index';


export const useProductStore = create<IProductStore>((set) => ({
    products: [],
    isLoading: false,
    setProduct: (products: IProduct[]) => set({ products }),
    createProduct: async (productData: IProduct) => {
        set({ isLoading: true });
        try {
            const res = await axios.post('/products', productData);
            set((prevState) => ({
                product: [...prevState.products, res.data],
                isLoading: false
            }))
        } catch (error: any) {
            toast.error(error?.message);
            set({ isLoading: false });
        }
    },
    fetchAllProducts: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('/products');
            set({ products: res.data.products, isLoading: false })
        } catch (error: any) {
            toast.error(error?.message);
            set({ isLoading: false })
        }
    },
    deleteProduct: async (productId: string) => {
        set({ isLoading: true })
        await axios.delete(`/products/${productId}`)
        set((prevProducts) => ({
            products: prevProducts.products.filter((product) => product._id !== productId),
            isLoading: false
        }))
    },
    toggleFeaturedProduct: async (productId: string) => {
        try {
            set({ isLoading: true });
            const res = await axios.patch(`/products/${productId}`)
            set((prevProducts) => ({
                products: prevProducts.products.map((product) => product._id === productId ?
                    { ...product, isFeatured: res.data.isFeatured } : product),
            }))
        } catch (error: any) {
            set({ isLoading: false })
            toast(error?.message)
            console.log(error);
        }
    },
    fetchProductByCategory: async (category: string) => {
        try {
            set({ isLoading: true })
            const res = await axios.get(`/products/category/${category}`)
            set({ products: res.data.products, isLoading: false })
        } catch (error: any) {
            set({ isLoading: false })
            toast.error(error?.message)
        }

    },
    fetchFeaturedProducts:async()=>{
        set({isLoading:true});
        try {
            const res=await axios.get('/products/featured')
            set({products:res.data,isLoading:false})
        } catch (error:any) {
            set({isLoading:false})
            console.log('error from fetchFeatureProducts',error)
        }
    }
}))