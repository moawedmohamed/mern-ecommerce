import { Request, Response } from "express";
import Coupon from "../models/coupon.model";
import { UserRequest } from "../interfaces";
import User from "../models/user.model";

export const getCoupon = async (req: UserRequest, res: Response) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user?._id, isActive: true });
        res.json(coupon || null);
    } catch (error: any) {
        console.log('Error in getCoupon Controller');
        res.status(500).json({ message: error.message });
    }
}
export const validateCoupon = async (req: UserRequest, res: Response) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, userId: req.user?._id, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: 'Coupon has expired' });
        }
        res.json({ message: "Coupon is valid", code: coupon.code, discount: coupon.discountPercentage });
    } catch (error: any) {
        console.log('Error in validateCoupon Controller');
        res.status(500).json({ error: error.message });
    }
}