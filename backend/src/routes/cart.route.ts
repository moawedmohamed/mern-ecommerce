import express, { Router } from 'express'
import { protectRoute } from '../middlewares/auth.middleware'
import { addCart, clearCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cart.controller'
const router = Router()
router.get("/",protectRoute,getCartProducts)
router.post("/",protectRoute,addCart)
router.delete("/",protectRoute,removeAllFromCart)
router.put("/:id",protectRoute,updateQuantity)
router.delete("/clearAll",protectRoute,clearCart)
export default router