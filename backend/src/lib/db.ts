import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const MONGO_URI: string = process.env.MONGO_URI || "";

export const connectDB = async () => {
    try {
        const con = await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully to ", con.connection.host);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}