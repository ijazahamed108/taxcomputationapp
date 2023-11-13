import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const HomePage = () => {
    const currentYear = new Date().getFullYear();

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <h1 className="display-3">Welcome to Tax Computation App</h1>
        <p className="lead">Please Login/Signup to continue</p>
      </div>
      <div className="mt-5">
        <Link to="/signup">
          <Button variant="primary" className="me-2">Signup</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary">Login</Button>
        </Link>
      </div>
      <footer className="mt-5">
        <p className="text-center">
          &copy; {currentYear} Ijaz Ahamed | Developed with ❤️ | Check my github: <a href="https://github.com/ijazahamed108" target="_blank" rel="noreferrer">https://github.com/ijazahamed108</a>
        </p>
      </footer>
    </Container>
  );
};

export default HomePage;
