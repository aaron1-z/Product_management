// src/pages/UpdateProductPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
// Import hooks for URL params and navigation
import { useParams, useNavigate } from 'react-router-dom';
// Import API functions
import { getProductById, updateProduct } from '../services/productService';
// Import the reusable form component
import ProductForm from '../components/ProductForm';

// Basic styling
const styles = {
    container: { maxWidth: '600px', margin: '30px auto', padding: '20px' },
    loading: { textAlign: 'center', padding: '50px', fontSize: '18px' },
    error: { color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px', marginBottom: '20px' },
};

function UpdateProductPage() {
    const { productId } = useParams(); // Get the 'productId' from the URL (:productId in App.jsx route)
    const navigate = useNavigate();    // Hook for navigation

    // State for the product data being edited
    const [product, setProduct] = useState(null); // Start as null until data is fetched

    // Separate loading/error states for initial fetch vs. form submission
    const [loading, setLoading] = useState(true);      // Loading initial product data
    const [error, setError] = useState('');            // Error during initial fetch
    const [submitLoading, setSubmitLoading] = useState(false); // Loading during form submit
    const [submitError, setSubmitError] = useState('');      // Error during form submit

    // Fetch the product data when the component mounts or productId changes
    const fetchProduct = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            console.log(`UpdatePage: Fetching product with ID: ${productId}`);
            const response = await getProductById(productId);
            setProduct(response.data); // Set the fetched product data into state
            console.log('UpdatePage: Product data fetched:', response.data);
        } catch (err) {
            console.error("UpdatePage: Failed to fetch product:", err);
            setError(err.response?.data?.message || err.message || 'Failed to load product data.');
            setProduct(null); // Ensure product state is null on error
        } finally {
            setLoading(false);
        }
    }, [productId]); // Dependency array includes productId

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]); // Call fetchProduct when the component mounts / fetchProduct changes

    // Handle the form submission (passed to ProductForm)
    const handleUpdateSubmit = async (formData) => {
        setSubmitLoading(true);
        setSubmitError('');

        try {
            console.log(`UpdatePage: Submitting update for ID: ${productId} with data:`, formData);
            await updateProduct(productId, formData); // Call the update API function
            console.log('UpdatePage: Product updated successfully');
            navigate('/products'); // Redirect to product list on success
        } catch (err) {
            console.error("UpdatePage: Failed to update product:", err);
            setSubmitError(err.response?.data?.message || err.message || 'Failed to update product.');
            setSubmitLoading(false); // Stop loading indicator on error
        }
         // No need to set loading false on success because we navigate away
    };

    // --- Render Logic ---

    // Display loading indicator during initial fetch
    if (loading) {
        return <div style={styles.loading}>Loading product details...</div>;
    }

    // Display error message if initial fetch failed
    if (error) {
        return <div style={{...styles.container, ...styles.error}}>Error: {error}</div>;
    }

    // Display message if product data couldn't be loaded (should be caught by error state, but as fallback)
    if (!product) {
        return <div style={styles.container}>Could not load product data.</div>;
    }

    // Render the form once product data is available
    return (
        <div style={styles.container}>
            {/* Title is now part of ProductForm */}
            <ProductForm
                onSubmit={handleUpdateSubmit} // Pass the update handler
                initialData={product}         // Pass fetched product data to pre-fill form
                isEdit={true}                 // Tell the form it's in edit mode
                loading={submitLoading}       // Pass submission loading state
                error={submitError}           // Pass submission error state
            />
        </div>
    );
}

export default UpdateProductPage;