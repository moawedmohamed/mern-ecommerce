import express, { Router } from 'express'
import { protectRoute } from '../middlewares/auth.middleware'
import { addCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cart.controller'
const router = Router()
router.get("/",protectRoute,getCartProducts)
router.post("/",protectRoute,addCart)
router.delete("/",protectRoute,removeAllFromCart)
router.put("/:id",protectRoute,updateQuantity)
export default router