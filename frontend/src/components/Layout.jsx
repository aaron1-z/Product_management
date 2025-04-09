// src/components/Layout.jsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
// --- Import Link from react-router-dom ---
import { Link, useNavigate } from 'react-router-dom';
// --- REMOVE LinkContainer import ---
// import { LinkContainer } from 'react-router-bootstrap';
// --- --- --- --- --- --- --- --- ---
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect after logout
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          {/* --- Use as={Link} and to="..." --- */}
          <Navbar.Brand as={Link} to={isAuthenticated ? "/products" : "/login"}>
            Product Management
          </Navbar.Brand>
          {/* --- --- --- --- --- --- --- --- */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <>
                  <Navbar.Text className="me-3">
                    Signed in as: {user?.email}
                  </Navbar.Text>
                  {/* --- Use as={Link} and to="..." --- */}
                  <Nav.Link as={Link} to="/products" style={{ color: 'rgba(255,255,255,.55)', marginRight: '.5rem' }} activeStyle={{color: 'white'}}> {/* Basic inline style for link color */}
                    Products
                  </Nav.Link>
                  {/* --- --- --- --- --- --- --- --- */}
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  {/* --- Use as={Link} and to="..." --- */}
                  <Nav.Link as={Link} to="/login" style={{ color: 'rgba(255,255,255,.55)', marginRight: '.5rem' }} activeStyle={{color: 'white'}}>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup" style={{ color: 'rgba(255,255,255,.55)', marginRight: '.5rem' }} activeStyle={{color: 'white'}}>
                    Sign Up
                  </Nav.Link>
                  {/* --- --- --- --- --- --- --- --- */}
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <main>{children}</main>
      </Container>

      <footer className="mt-5 p-4 bg-light text-center">
        <Container>
          <small>© Product Management App</small>
        </Container>
      </footer>
    </>
  );
}

export default Layout;