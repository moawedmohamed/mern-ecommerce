import { Request, Response } from "express";
import Product from "../models/product.model";
import { redis } from "../lib/redis";
import cloudinary from "../lib/cloudnary";

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const getFeaturedProducts = async (req: Request, res: Response) => {
    try {
        let featuredProducts: string | null = await redis.get('featured_products')
        if (featuredProducts) {
            res.status(200).json(JSON.parse(featuredProducts));
        }
        const product = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            res.status(404).json({ message: "No featured products found" });
        }
        await redis.set('featured_products', JSON.stringify(product)); // 1 day
    } catch (error) {

    }
}

// *create products

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, image, description, category, isFeatured } = req.body
        let cloudinaryResponse = null;
        cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
            category,
            isFeatured
        })
        res.status(201).json({ product })
    } catch (error) {

    }
}

// delete product

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        if (product.image) {
            const productId = product.image.split("/").pop()?.split(".")[0]
            try {
                await cloudinary.uploader.destroy(`products/${productId}`)
                console.log('deleted image form cloudinary');
            } catch (error) {
                console.log('error while deleting image from cloudinary', error);
            }
        }
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error: any) {

        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getRecommendedProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ $sample: { size: 3 } }, { $project: { _id: 1, name: 1, description: 1, price: 1, image: 1, category: 1, isFeatured: 1 } })
    } catch (error: any) {
        console.log('error form recommendation function', error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getProductByCategory = (req: Request, res: Response) => {
    const { category } = req.params
    try {
        const product = Product.find({ category })
        res.status(200).json({ product })

    } catch (error: any) {
        console.log('error form getCategory function', error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const toggleFeaturedProduct = async (req: Request, res: Response){
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updatedFeaturedProductsCache();
            res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error: any) {
        console.log('error form toggleFeaturedProduct function', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updatedFeaturedProductsCache() {
    try {

        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts))
    } catch (error: Error | any) {
        console.log('error in update cache function', error.message);
    }
}