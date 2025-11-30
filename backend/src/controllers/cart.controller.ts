import { Request, Response } from "express";
import { UserRequest, IProduct } from "../interfaces";
import Product from "../models/product.model";

export const getCartProducts = async (req: UserRequest, res: Response) => {
    try {
        console.log("USER CART ITEMS RAW:", req.user?.cartItem);
        const products = await Product.find({ _id: { $in: req.user?.cartItem } })
        console.log(products);
        const cartItems = products.map((product) => {
            const item = req.user?.cartItem.find(item => item._id === product._id);
            return { ...product.toJSON(), quantity: item?.quantity }
        })
        return res.status(200).json(cartItems)
    } catch (error: any) {
        console.log('Error in getCartProducts controller', error);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}
export const addCart = async (req: UserRequest, res: Response) => {
    try {
        const { productId } = req.body;
        const user = req.user
        const existingItem = user?.cartItem.find(item => item._id === productId)
        if (existingItem) {
            existingItem.quantity++
        } else {
            user?.cartItem.push(productId)
        }
        await user?.save()
        res.status(200).json({ message: "Product added to cart", cart: user?.cartItem })
    } catch (error: any) {
        console.log('Error in addToCart controller', error.message);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}
export const removeAllFromCart = async (req: UserRequest, res: Response) => {
    try {
        const { productId } = req.body;
        console.log(req.body);
        const user = req.user;
        if (!productId && user) {
            user.cartItem = [];
        } else {

            if (user) {
                console.log("Cart before filter:", user.cartItem);
                user.cartItem = (user?.cartItem || []).filter(item => item._id !== productId)
            }
        }
        await user?.save()
        res.status(200).json({ message: "Product removed from cart", cart: user?.cartItem })

    } catch (error: any) {
        console.log('Error in removeFromCart controller', error);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}
export const updateQuantity = async (req: UserRequest, res: Response) => {
    try {
        const { id: productId } = req.params
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user?.cartItem.find(item => item._id === productId);
        if (existingItem) {
            if (quantity === 0 && user) {
                user.cartItem = user.cartItem.filter(item => item._id !== productId)
                await user.save();
                return res.status(200).json(user?.cartItem)
            }
            existingItem.quantity = quantity
        } else {
            res.status(404).json({ message: "Product not found" })
        }
    } catch (error: any) {
        console.log('Error in updateQuantity controller', error.message);
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

