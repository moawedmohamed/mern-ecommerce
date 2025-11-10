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