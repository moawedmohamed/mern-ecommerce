import { Document, Types } from "mongoose";
export interface ICartItem {
    quantity: number;
    product: Types.ObjectId;
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin";
    cartItem: ICartItem[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}