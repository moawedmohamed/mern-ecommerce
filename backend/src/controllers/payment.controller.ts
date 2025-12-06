import { Response } from "express";
import { UserRequest } from "../interfaces";
import Coupon from "../models/coupon.model";
import { stripe } from "../lib/stripe";
import Order from "../models/orderModel";

export const createCheckoutSession = async (req: UserRequest, res: Response) => {
    try {
        const { products, couponCode } = req.body
        if (!Array.isArray(products) || products.length == 0) {
            return res.status(400).json({ message: "Invalid products" })
        }
        let totalAmount = 0;
        const linItems = products.map((product: any) => {
            const amount = Math.round(product.price * 100) // Stripe expects the amount in cents
            totalAmount += amount * product.quantity
            const image = product.image ?? ''
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: image ? [image] : undefined,
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity,
            }
        })
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user?._id, isActive: true })
            if (coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100)
            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: linItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL ?? ''}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL ?? ''}/purchase-cancel`,
            discounts: coupon ? [
                {
                    coupon: await createStripeCoupon(coupon.discountPercentage),
                }
            ] : [],
            metadata: {
                userId: req.user && req.user._id ? req.user._id.toString() : '',
                couponCode: couponCode || '',
                products: JSON.stringify(
                    products.map((p) => ({
                        productId: p._id,
                        name: p.name,
                        price: p.price,
                        quantity: p.quantity
                    }))
                )
            }
        })
        if (totalAmount >= 2000) {
            if (req.user?._id)
                await createNewCoupon(req.user._id.toString())
        }
        return res.status(200).json({ url: session.url, totalAmount: totalAmount / 100 })
    } catch (error: any) {
        console.log('Error in the payment controller ', error);
        return res.status(500).json({ message: error.message })
    }
}

const createStripeCoupon = async (discountPercentagePercentage: number) => {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentagePercentage,
        duration: "once"
    })
    return coupon.id;
}
const createNewCoupon = async (userId: string) => {
    await Coupon.findOneAndDelete({ userId });
    const coupon = await Coupon.create({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentagePercentage: 10,
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
        userId: userId,
    })
    await coupon.save();
    return coupon;
}


export const createCheckoutSuccess = async (req: UserRequest, res: Response) => {
    try {
        const { sessionId } = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
            if (session.metadata?.couponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                }, {
                    isActive: false
                })
            }
            const products = JSON.parse(session.metadata?.products || "[]");
            const newOrder = await Order.create({
                user: session.metadata?.userId,
                products: products.map((product: { productId: number, quantity: number, price: number }) => ({
                    product: product.productId,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: (session.amount_total ?? 0) / 100,
                stripeSessionId: sessionId
            })
            await newOrder.save();
            res.status(200).json({
                success: true,
                message: "Payment successful",
                orderId: newOrder._id
            })
        }

    } catch (error: any) {
        console.log('Error in the payment controller ',error);
        res.status(500).json({ message: "Payment failed", error: error.message })
    }
}    
