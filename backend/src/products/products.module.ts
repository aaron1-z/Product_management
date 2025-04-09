// backend/src/products/products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// --- CORRECTED IMPORT PATHS ---
import { ProductsService } from './products.service';     // Use './' for same directory
import { ProductsController } from './products.controller'; // Use './' for same directory
// --- --- --- --- --- --- --- ---
import { Product, ProductSchema } from './schemas/product.schema'; // Path to subfolder is correct
import { AuthModule } from '../auth/auth.module'; // Path up and into auth is correct

@Module({
  imports: [
    // Register the Product schema within this module's scope
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),

    // Import AuthModule to make JWT Guard available
    AuthModule,
  ],
  // Declare the controller and service belonging to this module
  controllers: [ProductsController], // Use correctly imported Controller
  providers: [ProductsService],      // Use correctly imported Service
})
export class ProductsModule {}