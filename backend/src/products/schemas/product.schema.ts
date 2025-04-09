// backend/src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose'; // Import mongoose for potential ObjectId refs later
// If you plan to link products to users later:
// import { User } from '../../users/schemas/user.schema';

// Define the Document type based on the Product class
export type ProductDocument = Product & Document;

@Schema({ timestamps: true }) // Automatically add createdAt and updatedAt fields
export class Product {
  @Prop({ required: true, trim: true }) // Define 'name' property
  name: string;

  @Prop({ required: true, trim: true }) // Define 'description' property
  description: string;

  @Prop({ required: true, trim: true, index: true }) // Define 'category', index for faster filtering
  category: string;

  @Prop({ required: true, type: Number }) // Define 'price' as a Number type in DB
  price: number;

  @Prop({ required: true, type: Number, min: 0, max: 5 }) // Define 'rating' as Number between 0-5
  rating: number;

  // Optional: Add owner field if doing user-specific products (Bonus/Later)
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) // Example Link to User
  // owner: User; // Or string if just storing ID

  // Optional: Add field for image filename (Bonus/Later)
  // @Prop({ required: false, trim: true })
  // imageUrl?: string;
}

// Create the Mongoose schema from the Product class
export const ProductSchema = SchemaFactory.createForClass(Product);

// Optional: Add text index for searching name and description together (requires MongoDB index creation)
// This helps optimize search queries using $text operator.
ProductSchema.index({ name: 'text', description: 'text' });