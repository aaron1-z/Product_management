// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// --- Import React Bootstrap components ---
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
// --- --- --- --- --- --- --- --- --- ---

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Optional: Add confirm password state if needed
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    // Optional: Validate passwords match
    // if (password !== confirmPassword) {
    //   setMessage("Passwords do not match.");
    //   setIsError(true);
    //   return;
    // }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      setMessage('Signup successful! Redirecting to login...');
      setIsError(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed. Please try again.');
      setIsError(true);
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {message && <Alert variant={isError ? 'danger' : 'success'}>{message}</Alert>}
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="signup-email"> {/* Use unique controlId */}
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter email"
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-password"> {/* Use unique controlId */}
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Password (min. 6 characters)"
                autoComplete="new-password"
              />
            </Form.Group>

            {/* Optional: Confirm Password Field */}
            {/* <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                // value={confirmPassword}
                // onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
            </Form.Group> */}

            <Button variant="success" type="submit" disabled={loading} className="w-100"> {/* Use success variant */}
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <RouterLink to="/login">Already have an account? Login</RouterLink>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SignupPage;