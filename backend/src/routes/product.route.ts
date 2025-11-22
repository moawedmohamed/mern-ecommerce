import express from "express";
import {
    getAllProducts, getFeaturedProducts, getProductByCategory
    , toggleFeaturedProduct, createProduct, deleteProduct, getRecommendedProducts
} from "../controllers/product.controller";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware";
const router = express.Router();
router.get("/", protectRoute, adminRoute, getAllProducts)
router.get("/featured", getFeaturedProducts)
router.get("/category/:category", getProductByCategory)
router.get("/recommendations", getRecommendedProducts)
router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)
export default router;