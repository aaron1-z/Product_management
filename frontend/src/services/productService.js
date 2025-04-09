// src/services/productService.js
import apiClient from './api'; // Import the configured Axios instance

/**
 * Fetch a list of products, potentially filtered, sorted, searched, and paginated.
 * @param {object} params - Optional query parameters object (e.g., { category, minPrice, search, page, limit, sortBy, sortOrder })
 * @returns {Promise} Axios promise resolving to the backend response (likely an array of products).
 */
export const getProducts = (params = {}) => {
  // apiClient will automatically include the Authorization header if a token exists (due to the interceptor)
  // Axios automatically converts the 'params' object into query string parameters
  return apiClient.get('/products', { params });
};

/**
 * Fetch a single product by its unique ID.
 * @param {string} id - The ID of the product.
 * @returns {Promise} Axios promise resolving to the backend response (the product object).
 */
export const getProductById = (id) => {
  if (!id) {
    return Promise.reject(new Error('Product ID is required.')); // Basic validation
  }
  return apiClient.get(`/products/${id}`);
};

/**
 * Create a new product.
 * @param {object} productData - Object containing product details { name, description, category, price, rating }.
 * @returns {Promise} Axios promise resolving to the backend response (the newly created product object).
 */
export const createProduct = (productData) => {
  // Basic validation (can be more extensive)
  if (!productData || !productData.name || !productData.price) {
     return Promise.reject(new Error('Required product data is missing.'));
  }
  return apiClient.post('/products', productData);
};

/**
 * Update an existing product by its ID. Allows partial updates.
 * @param {string} id - The ID of the product to update.
 * @param {object} productData - Object containing the fields to update.
 * @returns {Promise} Axios promise resolving to the backend response (the updated product object).
 */
export const updateProduct = (id, productData) => {
   if (!id) {
     return Promise.reject(new Error('Product ID is required for update.'));
   }
  return apiClient.patch(`/products/${id}`, productData);
};

/**
 * Delete a product by its ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise} Axios promise resolving to the backend response (e.g., { deleted: true, _id: id }).
 */
export const deleteProduct = (id) => {
   if (!id) {
     return Promise.reject(new Error('Product ID is required for deletion.'));
   }
  return apiClient.delete(`/products/${id}`);
};

// You could add more specific functions here if needed, e.g., getCategories()