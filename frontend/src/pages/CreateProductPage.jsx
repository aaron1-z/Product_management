// src/pages/CreateProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after creation
import { createProduct } from '../services/productService'; // API function
import ProductForm from '../components/ProductForm'; // The reusable form component

// Basic styling
const styles = {
    container: { maxWidth: '600px', margin: '30px auto', padding: '20px' },
    title: { textAlign: 'center', marginBottom: '20px'} // Redundant if title is in form
};

function CreateProductPage() {
    const navigate = useNavigate(); // Hook for navigation
    const [loading, setLoading] = useState(false); // State for submission loading
    const [error, setError] = useState('');     // State for submission error

    // This function will be passed to the ProductForm's onSubmit prop
    const handleCreateSubmit = async (formData) => {
        setLoading(true); // Indicate loading
        setError('');     // Clear previous errors

        try {
            // Call the API service function to create the product
            const newProduct = await createProduct(formData);
            console.log('Product created successfully:', newProduct.data);

            // Navigate back to the product list page on success
            navigate('/products');
        } catch (err) {
            console.error("Failed to create product:", err);
            // Set error state to display message in the form
            setError(err.response?.data?.message || err.message || 'Failed to create product.');
            setLoading(false); // Stop loading indicator on error
        }
        // No need to setLoading(false) on success because we navigate away
    };

    return (
        <div style={styles.container}>
            {/* Optional: Title here if not using the one inside ProductForm */}
            {/* <h1 style={styles.title}>Create New Product</h1> */}

            {/* Render the reusable form */}
            <ProductForm
                onSubmit={handleCreateSubmit} // Pass the submit handler
                loading={loading}             // Pass loading state
                error={error}                 // Pass error state
                isEdit={false}                // Indicate this is NOT edit mode
                // initialData is not needed for creation
            />
        </div>
    );
}

export default CreateProductPage;