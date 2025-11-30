import { Request } from "express";
import { Document, Types } from "mongoose";
export interface ICartItem {
    _id: string;
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
export interface UserRequest extends Request {
    user?: IUser | null;
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