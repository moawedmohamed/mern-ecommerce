import { Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { redis } from "../lib/redis";
import { UserRequest } from "../interfaces";
const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" })
    return { accessToken, refreshToken }
}
const storeRefreshToken = async (userId: string, refreshToken: string) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, {
        ex: 7 * 24 * 60 * 60 // 7 days
    });
}
const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent xxs attacks
        sameSite: "strict", // CSRF protection
        maxAge: 15 * 60 * 1000, // 15 minutes
        secure: process.env.NODE_ENV === "production", // only send cookie over https

    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent xxs attacks
        sameSite: "strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000,// 7 days, 
        secure: process.env.NODE_ENV === "production", // only send cookie over https

    })
}
export const signup = async (req: Request, res: Response) => {
    const { name, email, password, role = "customer" } = req.body;
    try {
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({ name, email, password, role });
        await user.save();
        // ** authenticate user
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        await storeRefreshToken(user._id.toString(), refreshToken);
        setCookies(res, accessToken, refreshToken)
        return res.status(201).json({
            message: "User created ", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        console.log('inside');
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (user && (await user.comparePassword(password))) {
            console.log('inside');
            const { accessToken, refreshToken } = generateTokens(user._id.toString());
            await storeRefreshToken(user._id.toString(), refreshToken);
            setCookies(res, accessToken, refreshToken)
            res.status(200).json({
                message: "Login successfully", user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error);
    }


}
export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload & { userId: string };
            await redis.del(`refreshToken:${decoded.userId}`);
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout has been successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload & { userId: string };
        const storedToken = await redis.get(`refreshToken:${decode.userId}`);
        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const accessToken = jwt.sign({ userId: decode.userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",

        })
        res.json({ message: "Token refeshed successfully " })
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getProfile = async (req: UserRequest, res: Response) => {
    try {
        res.json(req.user);
    } catch (error: any) {
        console.log('Error for the getProfile function');
        res.status(500).json({ message: "Server error", error: error.message });
    }
}