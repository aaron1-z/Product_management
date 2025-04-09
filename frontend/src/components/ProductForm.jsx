// src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
// --- Import React Bootstrap components ---
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// --- --- --- --- --- --- --- --- --- ---

function ProductForm({ onSubmit, initialData = {}, isEdit = false, loading = false, error = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: '',
  });

  // Effect to populate form for editing
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price?.toString() || '',
        rating: initialData.rating?.toString() || '',
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const priceNum = parseFloat(formData.price);
    const ratingNum = parseFloat(formData.rating);

    // Basic validation (could be improved with formik/yup or react-hook-form)
    if (!formData.name || !formData.description || !formData.category || !formData.price || !formData.rating) {
        alert('Please fill out all fields.');
        return;
    }
     if (isNaN(priceNum) || priceNum < 0) {
        alert('Please enter a valid non-negative price.');
        return;
    }
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
        alert('Please enter a rating between 0 and 5.');
        return;
    }

    const dataToSubmit = {
      ...formData,
      price: priceNum,
      rating: ratingNum,
    };
    onSubmit(dataToSubmit);
  };

  return (
    // Use React Bootstrap Form component
    <Form onSubmit={handleSubmit} noValidate>
      <h2 className="text-center mb-4">
        {isEdit ? 'Edit Product' : 'Create New Product'}
      </h2>

      {/* Display error message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Form Fields using Form.Group and Form.Control */}
      <Form.Group className="mb-3" controlId="productName">
        <Form.Label>Product Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter product name"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="productDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea" // Use 'as' prop for textarea
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter product description"
        />
      </Form.Group>

      {/* Use Row and Col for side-by-side layout */}
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="productCategory"> {/* Use md="6" for medium screens and up */}
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., Electronics, Books"
          />
        </Form.Group>

        <Form.Group as={Col} md="3" controlId="productPrice">
          <Form.Label>Price ($)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="0.00"
          />
        </Form.Group>

        <Form.Group as={Col} md="3" controlId="productRating">
          <Form.Label>Rating (0-5)</Form.Label>
          <Form.Control
            type="number"
            name="rating"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., 4.5"
          />
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit" disabled={loading} className="w-100">
        {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Product')}
      </Button>
    </Form>
  );
}

export default ProductForm;