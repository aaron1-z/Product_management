// backend/src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose'; // Import FilterQuery for dynamic queries
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto'; // Import the Query DTO

@Injectable()
export class ProductsService {
  // Inject the Mongoose Model for the 'Product' schema
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  /**
   * Creates a new product document in the database.
   * @param createProductDto - Data for the new product.
   * @returns The newly created product document.
   */
  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save(); // Persist to MongoDB
  }

  /**
   * Finds all products, applying filtering, searching, sorting, and pagination based on query DTO.
   * @param queryDto - Contains optional query parameters.
   * @returns An array of product documents matching the criteria.
   * Note: For production pagination, returning total count is also recommended.
   */
  async findAll(queryDto: QueryProductDto): Promise<ProductDocument[]> {
    // Destructure query parameters from the DTO, using defaults from DTO definition
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      search,
      sortBy,
      sortOrder = 'desc', // Default direction from DTO
      page = 1,         // Default page from DTO
      limit = 10,        // Default limit from DTO
    } = queryDto;

    // Build the Mongoose query object dynamically
    const query: FilterQuery<ProductDocument> = {};

    // --- Filtering ---
    if (category) {
      // Case-insensitive category matching (optional, adjust if needed)
      query.category = new RegExp(`^${category}$`, 'i');
      // Or exact match: query.category = category;
    }

    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice; // Greater than or equal to minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice; // Less than or equal to maxPrice
    }

    // Rating range filtering
    if (minRating !== undefined || maxRating !== undefined) {
        query.rating = {};
        if (minRating !== undefined) query.rating.$gte = minRating;
        if (maxRating !== undefined) query.rating.$lte = maxRating;
    }

    // --- Searching ---
    if (search) {
      // Option 1: Case-insensitive regex search on name and description
      const searchRegex = new RegExp(search.trim(), 'i'); // 'i' for case-insensitive
      query.$or = [ // Match if search term is in name OR description
        { name: searchRegex },
        { description: searchRegex },
      ];

      // Option 2: Using MongoDB $text search (requires text index in schema)
      // If using this, ensure ProductSchema.index({ name: 'text', description: 'text' }) exists
      // query.$text = { $search: search.trim() };
      // Note: $text search cannot usually be combined easily with regex in the same $or/$and
    }

    // --- Sorting ---
    const sortOptions: any = {};
    if (sortBy) {
      // Map DTO sort field to actual DB field if needed, here they match
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1; // -1 for desc, 1 for asc
    } else {
      // Default sort if sortBy is not provided
      sortOptions['createdAt'] = -1; // Sort by newest first
    }

    // --- Pagination ---
    const skip = (page - 1) * limit; // Calculate documents to skip

    // Execute the query using Mongoose methods
    return this.productModel
      .find(query)       // Apply the filter/search query
      .sort(sortOptions) // Apply sorting
      .skip(skip)        // Apply pagination skip
      .limit(limit)      // Apply pagination limit
      .exec();           // Execute the query and return a Promise
  }

  /**
   * Finds a single product by its MongoDB ObjectId.
   * @param id - The product's ID.
   * @returns The product document.
   * @throws NotFoundException if the product with the given ID is not found.
   */
  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      // Throw standard NestJS exception if not found
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    return product;
  }

  /**
   * Updates an existing product by ID.
   * Allows partial updates based on fields provided in the DTO.
   * @param id - The ID of the product to update.
   * @param updateProductDto - An object containing fields to update.
   * @returns The updated product document.
   * @throws NotFoundException if the product with the given ID is not found.
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    // findByIdAndUpdate finds the doc and updates it atomically
    // { new: true } option returns the document *after* the update has been applied
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    return updatedProduct;
  }

  /**
   * Deletes a product by its ID.
   * @param id - The ID of the product to delete.
   * @returns An object indicating success or throws an exception.
   * @throws NotFoundException if the product with the given ID is not found.
   */
  async remove(id: string): Promise<{ deleted: boolean; _id: string }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      // If findByIdAndDelete returns null, the document didn't exist
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    // Return a confirmation object
    return { deleted: true, _id: id };
  }
}