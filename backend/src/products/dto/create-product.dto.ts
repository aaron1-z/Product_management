// backend/src/products/dto/create-product.dto.ts
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max,
    MinLength, // Optional: Add minimum length for strings if desired
  } from 'class-validator';
  import { Type } from 'class-transformer'; // Needed for validation pipe to transform types
  
  export class CreateProductDto {
    @IsString({ message: 'Name must be a string.' })
    @IsNotEmpty({ message: 'Name cannot be empty.' })
    @MinLength(3, { message: 'Name must be at least 3 characters long.' }) // Example min length
    name: string;
  
    @IsString({ message: 'Description must be a string.' })
    @IsNotEmpty({ message: 'Description cannot be empty.' })
    description: string;
  
    @IsString({ message: 'Category must be a string.' })
    @IsNotEmpty({ message: 'Category cannot be empty.' })
    category: string;
  
    // Ensure price is treated as a number, even if sent as string from forms
    @Type(() => Number) // Attempt to transform incoming value to number
    @IsNumber({}, { message: 'Price must be a number.' })
    @IsNotEmpty({ message: 'Price cannot be empty.' })
    @Min(0, { message: 'Price cannot be negative.' })
    price: number;
  
    // Ensure rating is treated as a number
    @Type(() => Number) // Attempt to transform incoming value to number
    @IsNumber({}, { message: 'Rating must be a number.' })
    @IsNotEmpty({ message: 'Rating cannot be empty.' })
    @Min(0, { message: 'Rating must be between 0 and 5.' })
    @Max(5, { message: 'Rating must be between 0 and 5.' })
    rating: number;
  }