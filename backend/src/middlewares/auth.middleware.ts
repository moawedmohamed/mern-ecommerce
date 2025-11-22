import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import { UserRequest } from "../interfaces";
export const protectRoute = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload & { userId: string };
            const user = await User.findById(decoded.userId).select("-password");
            if (!user) {
                return res.status(401).json({ message: " User not found" });
            }
            req.user = user;
            next();
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Unauthorized - Token expired" });
            }
            throw error;
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
}

export const adminRoute = async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
       return res.status(403).json({ message: "Access denied - You are not an admin" });
    }
}