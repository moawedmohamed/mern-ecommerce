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
import analyticsRoutes from './routes/analytics.route';
import { connectDB } from './lib/db';
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app = express();
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
const PORT: number = Number(process.env.PORT);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
