import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [taxAuditRecords, setTaxAuditRecords] = useState([]);
  const [selectedAuditRecordId, setSelectedAuditRecordId] = useState('');
  const [selectedAuditRecord, setSelectedAuditRecord] = useState({
    userId: '',
    financialYear: '',
    upiId: '',
    netTaxPayable: '',
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState({
    name: '',
    userId: '',
    role: '',
    email: '',
  });

  const isAuthenticated = () => {
   
    return !!localStorage.getItem('token');
  };

  useEffect(() => {
    if (!isAuthenticated()) {
        window.location.href = '/';
    }
    fetchUsers();
    fetchTaxAuditRecords();
  }, []);

  const handleEditAuditRecord = (recordId) => {
    const recordToEdit = taxAuditRecords.find((record) => record._id === recordId);
    setSelectedAuditRecordId(recordId);
    setSelectedAuditRecord(recordToEdit);
  };
  const handleCancelAuditRecord = () => {
    setSelectedAuditRecordId('');
    setSelectedAuditRecord({
      userId: '',
      financialYear: '',
      upiId: '',
      netTaxPayable: '',
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTaxAuditRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/get-audit-records', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTaxAuditRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAuditRecord = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/update-tax-audit-record/${selectedAuditRecordId}`,
        selectedAuditRecord,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchTaxAuditRecords(); // to Rfresh the audit records list after update
      setSelectedAuditRecordId('');
      setSelectedAuditRecord({
        userId: '',
        financialYear: '',
        upiId: '',
        netTaxPayable: '',
      });
    } catch (error) {
      console.error(error);
    }
  };
    const handleEditUser = (userId) => {
        const userToEdit = users.find((user) => user.userId === userId);
        setSelectedUserId(userId);
        setSelectedUser(userToEdit);
    };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleCancel = () =>{
    setSelectedUserId('');
    setSelectedUser({
        name: '',
        userId: '',
        role: '',
        email: '',
      });
  }
  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/update-user/${selectedUserId}`, selectedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers(); 
      setSelectedUserId('');
      setSelectedUser({
        name: '',
        userId: '',
        role: '',
        email: '',
      });
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Container>
      <Row>
      
        <Col>
          <h2>Admin Dashboard</h2>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="danger" onClick={handleLogout} style={{ minWidth: '80px' }}>
              Logout
            </Button>
          </div>
          <Tabs defaultActiveKey="users">
            <Tab eventKey="users" title="Users">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>UserID</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.name}</td>
                      <td>{user.userId}</td>
                      <td>{user.role}</td>
                      <td>{user.email}</td>
                      {<td>
                        <Button variant="info" onClick={() => handleEditUser(user.userId)}>
                          Edit
                        </Button>
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </Table>
              {selectedUserId && (
                <div>
                  <h4>Edit User</h4>
                  <Form>
                    <Form.Group controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedUser.name}
                        onChange={handleChange}
                        name='name'
                      />
                    </Form.Group>
                    <Form.Group controlId="userId">
                      <Form.Label>User ID</Form.Label>
                      <Form.Control type="text" value={selectedUser.userId} disabled />
                    </Form.Group>
                    <Form.Group controlId="role">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedUser.role}
                        onChange={handleChange}
                        name="role"
                      />
                    </Form.Group>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={selectedUser.email}
                        onChange={handleChange}
                        name="email"
                      />
                    </Form.Group>
                    <Button variant="success" onClick={handleUpdateUser}>
                      Update User
                    </Button>
                    <Button variant="danger" onClick={handleCancel}>
                     Cancel
                    </Button>
                  </Form>
                </div>
              )}
            </Tab>
            <Tab eventKey="auditRecords" title="Audit Records">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Financial Year</th>
                    <th>UPI ID</th>
                    <th>Net Tax Payable</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taxAuditRecords.map((record) => (
                    <tr key={record._id}>
                      <td>{record.userId}</td>
                      <td>{record.financialYear}</td>
                      <td>{record.upiId}</td>
                      <td>{record.amount}</td>
                      <td>
                        <Button variant="info" onClick={() => handleEditAuditRecord(record._id)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {selectedAuditRecordId && (
                <div>
                  <h4>Edit Audit Record</h4>
                  <Form>
                    {/* Audit form Edit */}
                    <Form.Group controlId="userId">
                      <Form.Label>User ID</Form.Label>
                      <Form.Control type="text" value={selectedAuditRecord.userId} disabled />
                    </Form.Group>
                    <Form.Group controlId="financialYear">
                      <Form.Label>Financial Year</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedAuditRecord.financialYear}
                        name = "financialYear"
                        onChange={(e) =>
                          setSelectedAuditRecord({
                            ...selectedAuditRecord,
                            financialYear: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="upiId">
                      <Form.Label>UPI ID</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedAuditRecord.upiId}
                        name = "upiId"
                        onChange={(e) =>
                          setSelectedAuditRecord({ ...selectedAuditRecord, upiId: e.target.value })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="netTaxPayable">
                      <Form.Label>Net Tax Payable</Form.Label>
                      <Form.Control
                        type="number"
                        value={selectedAuditRecord.amount}
                        name = "netTaxPayable"
                        onChange={(e) =>
                          setSelectedAuditRecord({
                            ...selectedAuditRecord,
                            netTaxPayable: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Button variant="success" onClick={handleUpdateAuditRecord}>
                      Update Audit Record
                    </Button>
                    <Button variant="danger" onClick={handleCancelAuditRecord}>
                      Cancel
                    </Button>
                  </Form>
                </div>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
