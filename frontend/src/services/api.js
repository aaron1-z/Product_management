// src/services/api.js
import axios from 'axios';

// Read the base URL from the environment variable set in .env
// Vite exposes env variables through import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'; // Fallback if not set

// Create a new Axios instance with custom configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Base URL for all requests made with this instance
  headers: {
    'Content-Type': 'application/json', // Default content type for POST/PATCH etc.
    // You could add other default headers here if needed
  },
});

// --- Axios Request Interceptor ---
// This function runs BEFORE each request is sent using this apiClient instance.
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from localStorage (or sessionStorage/cookie if you prefer)
    const token = localStorage.getItem('accessToken');

    // If a token exists, add it to the Authorization header
    if (token) {
      // Add the 'Bearer ' prefix, which is expected by our backend JWT strategy
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Important: Return the config object for the request to proceed
    return config;
  },
  (error) => {
    // Handle request errors (e.g., network error before request is sent)
    console.error('Axios request interceptor error:', error);
    return Promise.reject(error); // Reject the promise to propagate the error
  }
);

// --- Axios Response Interceptor (Optional but Recommended) ---
// This function runs AFTER a response is received, or if an error occurred.
apiClient.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  (response) => response, // Simply return successful responses

  // Any status codes that falls outside the range of 2xx cause this function to trigger
  (error) => {
    // Check if the error is specifically a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      console.error('API Response Error: 401 Unauthorized');
      // This likely means the JWT token is invalid or expired.

      // Clear the potentially invalid token and user info from storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user'); // Assuming user info is stored too

      // Redirect the user to the login page.
      // Using window.location.href forces a full page reload, clearing app state.
      // In a larger app, you might dispatch a logout action or use React Router's navigate.
      if (window.location.pathname !== '/login') { // Avoid redirect loop if already on login
         window.location.href = '/login';
      }
    }
    // For other errors (404, 500, etc.), just reject the promise so the
    // component/service that made the request can handle it.
    return Promise.reject(error);
  }
);

// Export the configured Axios instance to be used throughout the application
export default apiClient;