import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [authorized, setAuthorized] = useState(() => localStorage.getItem('adminAuthorized') === 'true');
  const [credentials, setCredentials] = useState({ username: '', code: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalContacts: 0,
    totalImages: 0
  });

  const ACCESS_USERNAME = 'admin';
  const ACCESS_CODE = '2468';

  useEffect(() => {
    if (authorized) {
      fetchStats();
    }
  }, [authorized]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, contactsRes, imagesRes] = await Promise.all([
        api.get('/products?limit=1').catch(() => ({ data: { pagination: { total: 0 } } })),
        api.get('/contacts?limit=1').catch(() => ({ data: { pagination: { total: 0 } } })),
        api.get('/images/all').catch(() => ({ data: [] }))
      ]);

      setStats({
        totalProducts: productsRes.data?.pagination?.total || 0,
        totalContacts: contactsRes.data?.pagination?.total || 0,
        totalImages: imagesRes.data?.length || 0
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (credentials.username.trim() === ACCESS_USERNAME && credentials.code.trim() === ACCESS_CODE) {
      localStorage.setItem('adminAuthorized', 'true');
      setAuthorized(true);
      setCredentials({ username: '', code: '' });
      setAlertMessage('Access granted successfully');
      setAlertVariant('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } else {
      setAlertMessage('Invalid username or access code');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('adminAuthorized');
    setAuthorized(false);
    setCredentials({ username: '', code: '' });
  };

  if (!authorized) {
    return (
      <div className="admin-auth-page">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="auth-card">
                <Card.Body>
                  <h2 className="admin-title mb-3">Admin Access</h2>
                  <p className="text-muted mb-4">Sign in to access the admin dashboard.</p>
                  {showAlert && (
                    <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
                      {alertMessage}
                    </Alert>
                  )}
                  <Form onSubmit={handleAuthSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Access Code</Form.Label>
                      <Form.Control
                        type="password"
                        value={credentials.code}
                        onChange={(e) => setCredentials(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="Enter access code"
                        required
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">
                      Unlock
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <Container className="py-5">
        {/* Header */}
        <div className="dashboard-header mb-5">
          <div>
            <h1 className="admin-title mb-2">Admin Dashboard</h1>
            <p className="text-muted">Manage your embroidery business from here</p>
          </div>
          <Button variant="outline-danger" onClick={handleSignOut} className="sign-out-btn">
            Sign Out
          </Button>
        </div>

        {showAlert && (
          <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)} className="mb-4">
            {alertMessage}
          </Alert>
        )}

        {/* Statistics */}
        <Row className="g-3 mb-5">
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body className="text-center">
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <div className="stat-icon products">
                      <i className="fas fa-box"></i>
                    </div>
                    <h3 className="stat-number">{stats.totalProducts}</h3>
                    <p className="stat-label">Total Products</p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body className="text-center">
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <div className="stat-icon contacts">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <h3 className="stat-number">{stats.totalContacts}</h3>
                    <p className="stat-label">Contact Messages</p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stat-card">
              <Card.Body className="text-center">
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <div className="stat-icon images">
                      <i className="fas fa-image"></i>
                    </div>
                    <h3 className="stat-number">{stats.totalImages}</h3>
                    <p className="stat-label">Site Images</p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navigation Cards */}
        <Row className="g-4">
          {/* Products Management */}
          <Col md={6} lg={4}>
            <Card className="nav-card products-card h-100">
              <Card.Body className="d-flex flex-column">
                <div className="card-icon">
                  <i className="fas fa-shirt"></i>
                </div>
                <h4 className="card-title">Product Management</h4>
                <p className="card-description">
                  Add, edit, or remove products from your catalog. Upload product images and manage inventory.
                </p>
                <Button
                  as={Link}
                  to="/admin/products"
                  variant="primary"
                  className="mt-auto"
                >
                  Manage Products
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Site Images */}
          <Col md={6} lg={4}>
            <Card className="nav-card images-card h-100">
              <Card.Body className="d-flex flex-column">
                <div className="card-icon">
                  <i className="fas fa-images"></i>
                </div>
                <h4 className="card-title">Site Images</h4>
                <p className="card-description">
                  Update hero banners, team photos, and branding images across your website.
                </p>
                <Button
                  as={Link}
                  to="/admin/images"
                  variant="warning"
                  className="mt-auto"
                >
                  Manage Site Images
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Statistics */}
          <Col md={6} lg={4}>
            <Card className="nav-card statistics-card h-100">
              <Card.Body className="d-flex flex-column">
                <div className="card-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h4 className="card-title">Statistics</h4>
                <p className="card-description">
                  View detailed analytics about your products, contacts, and site performance.
                </p>
                <Button
                  as={Link}
                  to="/admin/statistics"
                  variant="success"
                  className="mt-auto"
                >
                  View Statistics
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Contacts */}
          <Col md={6} lg={4}>
            <Card className="nav-card contacts-card h-100">
              <Card.Body className="d-flex flex-column">
                <div className="card-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h4 className="card-title">Contact Messages</h4>
                <p className="card-description">
                  Review and respond to contact form submissions from your customers.
                </p>
                <Button
                  as={Link}
                  to="/admin/contacts"
                  variant="info"
                  className="mt-auto"
                >
                  View Messages
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;
