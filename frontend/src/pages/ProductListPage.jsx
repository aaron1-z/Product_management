// src/pages/ProductListPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getProducts, deleteProduct } from '../services/productService';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// --- Import React Bootstrap components ---
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup'; // For combining elements
import Dropdown from 'react-bootstrap/Dropdown'; // Alternative for category? Or keep Select
import Pagination from 'react-bootstrap/Pagination'; // For pagination later
import Spinner from 'react-bootstrap/Spinner'; // Loading indicator
import { PencilSquare, Trash3Fill } from 'react-bootstrap-icons'; // Import icons
// --- --- --- --- --- --- --- --- --- ---

// Debounce function
function debounce(func, wait) { /* ... (keep debounce function as before) ... */
   let timeout;
   return function executedFunction(...args) {
     const later = () => {
       clearTimeout(timeout);
       func(...args);
     };
     clearTimeout(timeout);
     timeout = setTimeout(later, wait);
   };
 }

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        category: '', minPrice: '', maxPrice: '', minRating: '', maxRating: '',
        search: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1, limit: 10,
    });
    // State for total items for pagination (assuming backend provides this eventually)
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / filters.limit);


    const fetchProducts = useCallback(async () => { /* ... (keep fetchProducts function as before, ensure it sets totalItems if backend provides count) ... */
        setLoading(true);
        setError('');
        console.log("Fetching with filters:", filters);
        try {
            const apiParams = {};
            for (const key in filters) {
                 // Only include non-empty filters
                if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
                    apiParams[key] = filters[key];
                }
            }
             // Ensure required pagination params are always sent
             apiParams.page = filters.page;
             apiParams.limit = filters.limit;

            const response = await getProducts(apiParams);
            setProducts(response.data);
            // *** IMPORTANT: Adjust this based on your actual backend response ***
            // If backend sends { products: [], totalCount: X } -> response.data.products, response.data.totalCount
            // If backend just sends [] -> response.data, response.data.length (limited pagination)
             setTotalItems(response.data.length); // Placeholder if backend doesn't send total count
            // setTotalItems(response.headers['x-total-count'] || response.data.length); // Example if using headers

        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError(err.response?.data?.message || 'Failed to load products.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const debouncedSearch = useCallback( /* ... (keep debounce function as before) ... */
         debounce((value) => {
             setFilters(prev => ({ ...prev, search: value, page: 1 }));
         }, 500),
     []);


    const handleFilterChange = (event) => { /* ... (keep handleFilterChange function as before, ensure name='search' is handled correctly for debouncing) ... */
        const { name, value } = event.target;
        if (name === 'search') {
             // Update input value immediately, debounce triggers API call
             setFilters(prev => ({ ...prev, search: value}));
             debouncedSearch(value);
        } else {
             setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
        }
    };


    const handleSort = (field) => { /* ... (keep handleSort function as before) ... */
        setFilters(prev => ({
            ...prev,
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
            page: 1,
        }));
    };

    const handleDelete = async (id) => { /* ... (keep handleDelete function as before) ... */
         if (window.confirm('Are you sure you want to delete this product?')) {
             try {
                 await deleteProduct(id);
                 fetchProducts(); // Refetch after delete
             } catch (err) {
                 console.error("Failed to delete product:", err);
                 setError(err.response?.data?.message || 'Failed to delete product.');
             }
         }
    };


    // --- Pagination Handlers ---
     const handlePageChange = (pageNumber) => {
         if (pageNumber >= 1 && pageNumber <= totalPages) { // Basic boundary check
             setFilters(prev => ({ ...prev, page: pageNumber }));
         }
     };

     // Example pagination items generation (can be more sophisticated)
     let paginationItems = [];
     if (totalPages > 1) {
         paginationItems.push(
             <Pagination.Prev key="prev" onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page <= 1} />
         );
         // Simplified: Show first, current, last page - needs improvement for many pages
         if (filters.page > 1) paginationItems.push(<Pagination.Item key={1} onClick={() => handlePageChange(1)}>{1}</Pagination.Item>);
         if (filters.page > 2) paginationItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
         paginationItems.push(<Pagination.Item key={filters.page} active>{filters.page}</Pagination.Item>);
         if (filters.page < totalPages -1) paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
         if (filters.page < totalPages) paginationItems.push(<Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>);

         paginationItems.push(
             <Pagination.Next key="next" onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page >= totalPages} />
         );
     }

    // --- --- --- --- --- --- ---

    const uniqueCategories = useMemo(() => { /* ... (keep uniqueCategories memo as before) ... */
         const categories = products.map(p => p.category);
         return [...new Set(categories)].sort();
     }, [products]);

    const getSortIndicator = (field) => {
        if (filters.sortBy === field) {
            return filters.sortOrder === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };


    return (
        <Container fluid="lg"> {/* Use fluid="lg" for wider container on large screens */}
            <Row className="align-items-center mb-4">
                <Col><h1>Product List</h1></Col>
                <Col xs="auto"> {/* Auto width for buttons */}
                    <Button variant="primary" onClick={() => navigate('/products/new')} className="me-2">
                       Add Product
                    </Button>
                    <Button variant="danger" onClick={logout}>Logout</Button>
                </Col>
            </Row>

            {/* Filter Section */}
            <Form className="p-3 border rounded mb-4 bg-light">
                <Row className="g-2"> {/* Use g-2 for gutters */}
                     <Col md={6} lg={3}>
                         <Form.Group controlId="searchFilter">
                             <Form.Label>Search Name/Desc</Form.Label>
                             <Form.Control
                                 type="text"
                                 name="search"
                                 placeholder="Search..."
                                 value={filters.search}
                                 onChange={handleFilterChange}
                             />
                         </Form.Group>
                     </Col>
                     <Col md={6} lg={2}>
                         <Form.Group controlId="categoryFilter">
                             <Form.Label>Category</Form.Label>
                             <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                                 <option value="">All</option>
                                 {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                 {/* Add predefined if needed */}
                                 <option value="Electronics">Electronics</option>
                                  <option value="Books">Books</option>
                             </Form.Select>
                         </Form.Group>
                     </Col>
                     <Col sm={6} lg={2}>
                       <Form.Group controlId="minPriceFilter">
                           <Form.Label>Min Price</Form.Label>
                           <Form.Control type="number" name="minPrice" min="0" value={filters.minPrice} onChange={handleFilterChange} />
                       </Form.Group>
                     </Col>
                     <Col sm={6} lg={2}>
                         <Form.Group controlId="maxPriceFilter">
                             <Form.Label>Max Price</Form.Label>
                             <Form.Control type="number" name="maxPrice" min="0" value={filters.maxPrice} onChange={handleFilterChange} />
                         </Form.Group>
                     </Col>
                      <Col sm={6} lg={1}>
                         <Form.Group controlId="minRatingFilter">
                             <Form.Label>Min Rate</Form.Label>
                             <Form.Control type="number" name="minRating" min="0" max="5" step="0.1" value={filters.minRating} onChange={handleFilterChange} />
                         </Form.Group>
                     </Col>
                     <Col sm={6} lg={1}>
                         <Form.Group controlId="maxRatingFilter">
                             <Form.Label>Max Rate</Form.Label>
                             <Form.Control type="number" name="maxRating" min="0" max="5" step="0.1" value={filters.maxRating} onChange={handleFilterChange} />
                         </Form.Group>
                     </Col>
                     {/* Add more filters if needed */}
                </Row>
            </Form>

            {/* Loading Spinner */}
            {loading && (
                 <div className="text-center my-5">
                     <Spinner animation="border" role="status">
                         <span className="visually-hidden">Loading...</span>
                     </Spinner>
                 </div>
             )}

            {/* Error Alert */}
            {error && <Alert variant="danger">Error: {error}</Alert>}

            {/* Product Table */}
            {!loading && !error && (
                <>
                    <Table striped bordered hover responsive size="sm"> {/* Use Bootstrap Table styles */}
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>Name{getSortIndicator('name')}</th>
                                <th>Description</th>
                                <th onClick={() => handleSort('category')} style={{cursor: 'pointer'}}>Category{getSortIndicator('category')}</th>
                                <th onClick={() => handleSort('price')} style={{cursor: 'pointer'}}>Price{getSortIndicator('price')}</th>
                                <th onClick={() => handleSort('rating')} style={{cursor: 'pointer'}}>Rating{getSortIndicator('rating')}</th>
                                <th onClick={() => handleSort('createdAt')} style={{cursor: 'pointer'}}>Created{getSortIndicator('createdAt')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category}</td>
                                        <td className="text-end">${product.price.toFixed(2)}</td> {/* text-end aligns right */}
                                        <td className="text-end">{product.rating.toFixed(1)}</td>
                                        <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/products/edit/${product._id}`)} title="Edit">
                                                     <PencilSquare /> {/* Edit Icon */}
                                                 </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product._id)} title="Delete">
                                                     <Trash3Fill /> {/* Delete Icon */}
                                                 </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination Component */}
                     {totalPages > 1 && (
                         <div className="d-flex justify-content-center">
                             <Pagination>{paginationItems}</Pagination>
                         </div>
                     )}
                </>
            )}
        </Container>
    );
}

export default ProductListPage;