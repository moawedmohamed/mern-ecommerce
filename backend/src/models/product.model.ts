import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isFeatured: boolean;
}
const productSchema: Schema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    image: { type: String, required: [true, 'Image is required'] },
    category: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },

}, { timestamps: true });

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product