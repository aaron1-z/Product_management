// backend/src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Import PartialType
import { CreateProductDto } from './create-product.dto'; // Import the base DTO

// UpdateProductDto inherits all properties from CreateProductDto,
// but PartialType makes all of them optional.
// Validation rules (like @IsString, @Min, @Max) are still inherited and applied
// if the property IS provided in the update request.
export class UpdateProductDto extends PartialType(CreateProductDto) {}