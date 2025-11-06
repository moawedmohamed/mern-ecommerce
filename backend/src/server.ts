import express from 'express';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import authRoutes from './routes/auth.route';
import cartRoutes from './routes/cart.route';
import couponRoutes from './routes/coupon.route';
import paymentRoutes from './routes/payment.route';
import productRoutes from './routes/product.route';
import { connectDB } from './lib/db';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
const PORT: number = Number(process.env.PORT);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
