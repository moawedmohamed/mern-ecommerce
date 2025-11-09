export type ISignup = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string

}
export interface IUser {
    id: string
    name: string
    email: string
}

export interface IUserStore {
    user: IUser | null
    isLoading: boolean
    checkingAuth: boolean
    signup: (data: ISignup) => Promise<void>
}