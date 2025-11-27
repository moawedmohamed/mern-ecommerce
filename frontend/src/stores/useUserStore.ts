/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import toast from 'react-hot-toast'
import axios from '../lib/axios'

import { type IUserStore, type ISignup, type ILogin } from '../interfaces'
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
        try {
            console.log(name, email, password);
            const res = await axios.post('/auth/signup', { name, email, password })
            set({ user: res.data.user, isLoading: false })
            toast.success(res.data.message || 'Account created successfully')
        } catch (error: any) {
            set({ isLoading: false });
            toast.error(error?.response.data.message || "an error occurred")
        }
    },
    login: async ({ email, password }: ILogin) => {
        set({ isLoading: true })
        try {
            const res = await axios.post('/auth/login', { email, password })
            console.log(res.data);
            set({ user: res.data.user, isLoading: false })
            toast.success(res.data.message || 'Login successful')
            console.log('from  login function');
        } catch (error: any) {
            set({ isLoading: false })
            // console.log(error?.response.data.message);
            toast.error(error?.response.data.message || 'Invalid credentials')
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error: any) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },
    logout: async () => {
        try {
            await axios.post('/auth/logout');
            set({ user: null });

        } catch (error: any) {
            toast.error(error?.response.data.message || 'An error occurred 1')
            console.log('object');
        }
    }
}))