// backend/src/products/products.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param, // To access route parameters like :id
    Delete,
    UseGuards, // To apply authentication guards
    Query,     // To access query parameters like ?category=Books
    ParseUUIDPipe, // Optional: If using UUIDs for IDs
    ParseIntPipe,  // Optional: If expecting integer params
    DefaultValuePipe, // Optional: For default query param values (handled in DTO now)
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { QueryProductDto } from './dto/query-product.dto'; // DTO for query params
  import { AuthGuard } from '@nestjs/passport'; // The default JWT guard we configured
  
  // Apply JWT protection to ALL routes within this controller
  @UseGuards(AuthGuard('jwt')) // Use the 'jwt' strategy defined in AuthModule
  @Controller('products') // Base route for all endpoints here: /products
  export class ProductsController {
    // Inject the ProductsService
    constructor(private readonly productsService: ProductsService) {}
  
    /**
     * Create a new product.
     * POST /products
     * Requires JWT authentication.
     * Request body validated by CreateProductDto.
     */
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
      // Delegate creation logic to the service
      return this.productsService.create(createProductDto);
    }
  
    /**
     * Find all products with optional filtering, searching, sorting, pagination.
     * GET /products?category=X&search=Y&sortBy=price&page=1&limit=20
     * Requires JWT authentication.
     * Query parameters validated by QueryProductDto.
     */
    @Get()
    findAll(@Query() queryDto: QueryProductDto) {
      // The ValidationPipe (global) automatically validates/transforms queryDto
      // console.log('Processed Query DTO:', queryDto); // Useful for debugging
      // Delegate finding logic (with filters etc.) to the service
      return this.productsService.findAll(queryDto);
    }
  
    /**
     * Find a single product by its ID.
     * GET /products/:id
     * Requires JWT authentication.
     * ':id' is a route parameter.
     */
    @Get(':id')
    // Param('id') extracts the 'id' part from the URL
    findOne(@Param('id') id: string) {
      // Delegate finding logic to the service
      return this.productsService.findOne(id);
      // Note: If using numeric IDs, you might add ParseIntPipe: @Param('id', ParseIntPipe)
      // Note: If using UUIDs, you might add ParseUUIDPipe: @Param('id', ParseUUIDPipe)
    }
  
    /**
     * Update a product by its ID. Allows partial updates.
     * PATCH /products/:id
     * Requires JWT authentication.
     * Request body validated by UpdateProductDto (allows optional fields).
     */
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto, // Validate partial body
    ) {
      // Delegate update logic to the service
      return this.productsService.update(id, updateProductDto);
    }
  
    /**
     * Delete a product by its ID.
     * DELETE /products/:id
     * Requires JWT authentication.
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
      // Delegate removal logic to the service
      // Service returns { deleted: true, _id: id } on success or throws NotFoundException
      return this.productsService.remove(id);
    }
  }