// backend/src/products/dto/query-product.dto.ts
import {
    IsOptional, // Decorator for optional fields
    IsString,
    IsNumber,
    Min,
    Max,
    IsIn,       // For checking against a list of allowed values (sorting)
    IsInt,      // For ensuring pagination params are integers
  } from 'class-validator';
  import { Type } from 'class-transformer'; // For type conversion of query params
  
  export class QueryProductDto {
    // --- Filtering ---
    @IsOptional() // This field is not required
    @IsString()
    category?: string; // Use '?' for optional properties
  
    @IsOptional()
    @Type(() => Number) // Convert query param string to number
    @IsNumber()
    @Min(0)
    minPrice?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(5)
    minRating?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(5)
    maxRating?: number;
  
    // --- Searching ---
    @IsOptional()
    @IsString()
    search?: string; // For name/description text search
  
    // --- Sorting (Bonus) ---
    @IsOptional()
    @IsIn(['price', 'rating', 'name', 'createdAt', 'category']) // Define allowed sort fields
    sortBy?: string; // Field to sort by
  
    @IsOptional()
    @IsIn(['asc', 'desc']) // Allowed sort directions
    sortOrder?: 'asc' | 'desc' = 'desc'; // Default direction if sortBy is provided
  
    // --- Pagination (Bonus) ---
    @IsOptional()
    @Type(() => Number) // Convert to number
    @IsInt()          // Ensure it's an integer
    @Min(1)           // Page number must be 1 or greater
    page?: number = 1;  // Default to page 1 if not provided
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10; // Default to 10 items per page if not provided
  }