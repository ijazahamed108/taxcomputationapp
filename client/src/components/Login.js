import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    
      // user on boarding
      const response = await axios.post('https://taxappserver.vercel.app/api/auth/login', {
        userId: formData.userId,
        password: formData.password,
      });

      // Store the token in local storage so that it can be sent to authenticate Apis
      localStorage.setItem('token', response.data.token);
     
      // Redirect based on user role
      const userRole = response.data.role;
      if (userRole === 'taxpayer') {
        navigate('/taxpayer-dashboard');
      } else if (userRole === 'taxaccountant') {
        navigate('/admin-dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard');
      }

     // restting the form
      setFormData({
        userId: '',
        password: '',
      });
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Login</h2>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your user ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
