// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

// --- Import Bootstrap CSS ---
import 'bootstrap/dist/css/bootstrap.min.css';
// --- --- --- --- --- --- ---

// import './index.css'; // Keep or remove based on whether you use index.css for custom styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);