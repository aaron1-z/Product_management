// src/App.jsx
import React from 'react';
// --- Import React Router components ---
import {
  BrowserRouter as Router, // Use BrowserRouter for standard web routing
  Routes,
  Route,
  Navigate, // For redirection
} from 'react-router-dom';
// --- --- --- --- --- --- --- --- ---

// --- Import Page Components ---
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductListPage from './pages/ProductListPage';
import CreateProductPage from './pages/CreateProductPage';
import UpdateProductPage from './pages/UpdateProductPage';
import NotFoundPage from './pages/NotFoundPage';
// --- --- --- --- --- --- ---

// --- Import Auth & Layout Components ---
import ProtectedRoute from './routes/ProtectedRoute'; // Our custom protected route
import { useAuth } from './contexts/AuthContext';    // Hook to check auth state
import Layout from './components/Layout';             // Optional Layout wrapper
// --- --- --- --- --- --- --- --- --- ---

function App() {
  // Get auth state to conditionally render/redirect routes
  const { isAuthenticated, loading } = useAuth();

  // Optional: Don't render routes until initial auth check is complete
  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Router> {/* Wrap everything in the Router */}
      <Layout> {/* Wrap Routes in the Layout component */}
        <Routes> {/* Define all the possible routes */}

          {/* --- Public Routes --- */}
          {/* If user is authenticated, redirect from /login to /products */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/products" replace /> : <LoginPage />}
          />
          {/* If user is authenticated, redirect from /signup to /products */}
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/products" replace /> : <SignupPage />}
          />

          {/* --- Protected Routes --- */}
          {/* Wrap product-related routes with ProtectedRoute */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <CreateProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:productId" // Use :productId as a URL parameter
            element={
              <ProtectedRoute>
                <UpdateProductPage />
              </ProtectedRoute>
            }
          />

          {/* --- Root Path Redirect --- */}
          {/* Redirect from '/' based on authentication status */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/products" replace /> // Go to products if logged in
              ) : (
                <Navigate to="/login" replace /> // Go to login if not logged in
              )
            }
          />

          {/* --- Catch-all 404 Route --- */}
          {/* This route matches any path not matched above */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;