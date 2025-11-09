import { create } from 'zustand'
import toast from 'react-hot-toast'
import axios from '../lib/axios'
import { type IUserStore, type ISignup } from '../interfaces'
export const useUserStore = create<IUserStore>((set, get) => ({
    user: null,
    isLoading: false,
    checkingAuth: true,
    signup: async ({ name, email, password, confirmPassword }: ISignup) => {
        set({ isLoading: true })
        if (password !== confirmPassword) {
            set({ isLoading: false })
            toast.error('Passwords do not match')
            return;
        }
        console.log('before');
        try {
            console.log('object');
            console.log(name, email, password);
            const res = await axios.post('/auth/signup', { name, email, password })

            set({ user: res.data.user, isLoading: false })
            toast.success(res.data.message || 'Account created successfully')
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error.response?.data?.message || "an error occurred")
        }
    },
    login: async (email: string, password: string) => {
    }
}))