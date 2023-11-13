import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, FormLabel } from 'react-bootstrap';
import axios from 'axios';


import { indianStates } from '../components/utils'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    country: ''
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
      // Check if userId and email are unique
      const checkUnique = await axios.post('https://taxappserver.vercel.app/api/auth/check-unique', {
        userId: formData.userId,
        email: formData.email,
      });


      if (!checkUnique.data.isUserIdUnique) {
        setErrorMessage('UserID not available, please try a different one.');
        return;
      }

      if (!checkUnique.data.isEmailUnique) {
        setErrorMessage('Email is already in use, please use a different one.');
        return;
      }


      // Signup user
      const response = await axios.post('https://taxappserver.vercel.app/api/auth/signup', {
        ...formData
      });
      // Store the token in local storage
      localStorage.setItem('token', response.data.token);
      navigate('/login');
      setFormData({
        name: '',
        userId: '',
        email: '',
        password: '',
        confirmPassword: '',
        state: '',
        country: ''
      });
      setErrorMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Sign Up</h2>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a unique user ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
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
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCountry">
              <FormLabel>Country</FormLabel>
              <Form.Control
                as="select"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                <option value="india">India</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formState">
              <FormLabel>State</FormLabel>
              <Form.Control
                as="select"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={formData.country !== 'india'}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign Up
            </Button>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
