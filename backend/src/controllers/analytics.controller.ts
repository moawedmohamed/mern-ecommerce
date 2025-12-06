import { Response } from "express";
import { UserRequest } from "../interfaces";
import User from "../models/user.model";
import Product from "../models/product.model";
import Order from "../models/orderModel";


export const createAnalytics = async (req: UserRequest, res: Response) => {
    try {
        const analyticsData = await getAnalyticsData()
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // subtract 7 days from endDate
        const dailySaleData = await getDailySaleData(startDate, endDate)
        res.json({
            analyticsData,
            dailySaleData
        })
    } catch (error: any) {
        console.log('Error form createAnalytics function',error);
        res.status(500).json({ message: error.message })
    }
}

const getAnalyticsData = async () => {
    try {
        const totalUsers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ])
        const { totalRevenue, totalSales } = salesData[0] || { totalRevenue: 0, totalSales: 0 }
        return {
            users: totalUsers,
            products: totalProducts,
            totalSales,
            totalRevenue,
        }
    } catch (error) {
        console.log('Error form getAnalyticsData function');
    }
}

const getDailySaleData = async (startDate: Date, endDate: Date) => {
    try {
        const dailySaleData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } }
        ])
        const dateArray = getDateInRange(startDate, endDate)
        return dateArray.map(date => {
            const foundData = dailySaleData.find(item => item._id === date)
            return {
                date,
                sales: foundData?.sales ?? 0,
                revenue: foundData?.revenue ?? 0
            }
        })
    } catch (error: any) {
        console.log('Error form getDailySaleData function');
        throw error
    }
}

const getDateInRange = (startDate: Date, endDate: Date) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);

    }
    return dateArray;
}