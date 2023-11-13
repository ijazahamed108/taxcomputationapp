import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [taxPaid, setTaxPaid] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [taxFormData, setTaxFormData] = useState({
    financialYear: '',
    totalIncome: '',
    panNumber: '',
    hra: '',
    healthInsurance: '',
  });
  const [taxResult, setTaxResult] = useState('');
  const [submissionHistory, setSubmissionHistory] = useState([]);

  // check if token is present in localstrge
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  useEffect(() => {
    // hide views if token is missing
    if (!isAuthenticated()) {
        window.location.href = '/';
    }
    fetchUserData();
  }, []);
  
  useEffect(() => {
    // After setting user data, fetch submission history
    if (userData.userId) {
      fetchSubmissionHistory();
    }
  }, [userData]); 

  const handlePayTaxes = () => {
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    try {
      // latest submission to get netTaxPayable
      const latestSubmission = submissionHistory[0];
        if(!upiId){
            setUpiId(false)
            return
        }
      const response = await axios.post('http://localhost:5000/api/computetax/paytaxes', {
        userId: userData.userId,
        upiId,
        amount: latestSubmission.netTaxPayable,
        financialYear: latestSubmission.financialYear,
      });
      if(response.data.paid){
        setTaxPaid(true)
      }

      setShowPaymentDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentDialog(false);
  };
  
  const fetchUserData = async () => {
    try {
      // Fetch user data from the server based on user ID
      const response = await axios.get('http://localhost:5000/api/auth/user-info', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Setting  user datain statee
      setUserData(response.data);
    } catch (error) {
      console.error(error);
      if (error.response.status === 403) window.location.href = '/';
    }
  };

  const fetchSubmissionHistory = async () => {
    try {
      // Fetch submission history from the server based on user ID
      const response = await axios.get('http://localhost:5000/api/computetax/get', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { userId: userData.userId }, // Include user ID in the request params
      });
  
      setSubmissionHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxFormData({ ...taxFormData, [name]: value });
  };

  const handleCheckTax = () => {
    setShowTaxForm(true);
  };

  const handleComputeTax = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/computetax/store', taxFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { userId: userData.userId },
      });
      setTaxResult(response.data.result);
      setShowTaxForm(false);
      fetchSubmissionHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmission = (submissionId) => {
   
    const selectedSubmission = submissionHistory.find((submission) => submission._id === submissionId);
    setTaxFormData({
      financialYear: selectedSubmission.financialYear,
      totalIncome: selectedSubmission.totalIncome,
      panNumber: selectedSubmission.panNumber,
      hra: selectedSubmission.hra,
      healthInsurance: selectedSubmission.healthInsurance,
    });

    setShowTaxForm(true);
  };

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Redirect to the home page
    window.location.href = '/';
  };

  const handleCancel = () => {
    // Reset tax form data and hide the form
    setTaxFormData({
      financialYear: '',
      totalIncome: '',
      panNumber: '',
      hra: '',
      healthInsurance: '',
    });
    setShowTaxForm(false);
  };

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Taxpayer Dashboard</h2>
          <p>User ID: {userData.userId}</p>
          <p>Email: {userData.email}</p>
          <p>State: {userData.state}</p>
          <p>Country: {userData.country}</p>
          {userData.role === 'taxpayer' && (
            <div>
              <Button onClick={handleCheckTax}>Check Tax</Button>
              {showTaxForm && (
                <Form>
                  <Form.Group controlId="financialYear">
                    <Form.Label>Financial Year</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      name="financialYear"
                      value={taxFormData.financialYear}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="totalIncome">
                    <Form.Label>Total Income</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      name="totalIncome"
                      value={taxFormData.totalIncome}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="panNumber">
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleChange}
                      name="panNumber"
                      value={taxFormData.panNumber}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="hra">
                    <Form.Label>HRA</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      name="hra"
                      value={taxFormData.hra}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="healthInsurance">
                    <Form.Label>Health Insurance</Form.Label>
                    <Form.Control
                      type="number"
                      onChange={handleChange}
                      name="healthInsurance"
                      value={taxFormData.healthInsurance}
                      required
                    />
                  </Form.Group>
                  <Button onClick={handleComputeTax}>Compute Now</Button>
                  <Button variant="secondary" onClick={() => setShowTaxForm(false)}>
                    Cancel
                  </Button>
                </Form>
              )}
              {taxResult && <p>Tax Result: {taxResult}</p>}
              <div className="mt-3">
                <h3>Submission History</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Submission Date</th>
                      <th>Financial Year</th>
                      <th>Total Income</th>
                      <th>PAN Number</th>
                      <th>HRA</th>
                      <th>Health Insurance</th>
                      <th>Net Tax Payable</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissionHistory.map((submission, index) => (
                      <tr key={submission._id}>
                        <td>{new Date(submission.submissionDate).toLocaleDateString()}</td>
                        <td>{submission.financialYear}</td>
                        <td>{submission.totalIncome}</td>
                        <td>{submission.panNumber}</td>
                        <td>{submission.hra}</td>
                        <td>{submission.healthInsurance}</td>
                        <td>{submission.netTaxPayable}</td>
                        <td>
                          {index === 0 && ( // Check if it's the most recent record
                            <Button variant="info" onClick={() => handleEditSubmission(submission._id)}>
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
                <Button variant="success" onClick={handlePayTaxes}>
                  Pay Taxes Now
                </Button>
                
              </div>
            </div>
          )}
        </Col>
      </Row>
      {/* Payment Dialog */}
      <Modal show={showPaymentDialog} onHide={handleCancelPayment}>
        <Modal.Header closeButton>
          <Modal.Title>Pay Taxes Now</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Net Tax Payable: {submissionHistory.length > 0 && submissionHistory[0].netTaxPayable}</p>
          <Form.Group controlId="upiId">
            <Form.Label>Enter UPI ID</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setUpiId(e.target.value)}
              value={upiId}
              name = "upiId"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
        <>
        {taxPaid && " Tax is already paid "}
        {!upiId && "Please Enter UPI ID to proceeed"}
          </>
          <Button variant="secondary" onClick={handleCancelPayment}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmPayment}>
            Pay
          </Button>
          
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
