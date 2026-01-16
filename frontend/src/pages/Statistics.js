import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Table, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Statistics.css';

function Statistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: [],
    categoryStats: {},
    embroideryStats: {},
    totalStats: {
      products: 0,
      inStock: 0,
      outOfStock: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      totalValue: 0,
      categories: 0,
      images: 0
    }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [productsRes, imagesRes] = await Promise.all([
        api.get('/products?limit=200'),
        api.get('/images/all')
      ]);

      const products = productsRes.data?.data || [];
      const images = imagesRes.data || [];

      // Calculate comprehensive stats
      const totalProducts = productsRes.data?.pagination?.total || products.length;
      const inStock = products.filter(p => p.inStock).length;
      const outOfStock = totalProducts - inStock;

      const prices = products.map(p => p.price);
      const avgPrice = prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices).toFixed(2) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices).toFixed(2) : 0;
      const totalValue = prices.length > 0 ? prices.reduce((a, b) => a + b, 0).toFixed(2) : 0;

      // Category breakdown
      const categoryStats = products.reduce((acc, p) => {
        if (!acc[p.category]) {
          acc[p.category] = { count: 0, avgPrice: 0, totalPrice: 0 };
        }
        acc[p.category].count += 1;
        acc[p.category].totalPrice += p.price;
        return acc;
      }, {});

      Object.keys(categoryStats).forEach(cat => {
        categoryStats[cat].avgPrice = (categoryStats[cat].totalPrice / categoryStats[cat].count).toFixed(2);
      });

      // Embroidery type breakdown
      const embroideryStats = products.reduce((acc, p) => {
        if (!acc[p.embroideryType]) {
          acc[p.embroideryType] = { count: 0, avgPrice: 0, totalPrice: 0 };
        }
        acc[p.embroideryType].count += 1;
        acc[p.embroideryType].totalPrice += p.price;
        return acc;
      }, {});

      Object.keys(embroideryStats).forEach(type => {
        embroideryStats[type].avgPrice = (embroideryStats[type].totalPrice / embroideryStats[type].count).toFixed(2);
      });

      setStats({
        products,
        categoryStats,
        embroideryStats,
        totalStats: {
          products: totalProducts,
          inStock,
          outOfStock,
          avgPrice,
          minPrice,
          maxPrice,
          totalValue,
          categories: Object.keys(categoryStats).length,
          images: images.length
        }
      });
      setError('');
    } catch (err) {
      console.error('Failed to load statistics', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const stockPercentage = stats.totalStats.products > 0
    ? Math.round((stats.totalStats.inStock / stats.totalStats.products) * 100)
    : 0;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading statistics...</p>
      </Container>
    );
  }

  return (
    <div className="statistics-page">
      <Container fluid className="py-5">
        {/* Header */}
        <div className="page-header mb-5">
          <div>
            <h1 className="admin-title">Advanced Statistics & Analytics</h1>
            <p className="subtitle">Comprehensive business insights and product analytics</p>
          </div>
          <Button as={Link} to="/admin" variant="outline-secondary">
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">{error}</Alert>
        )}

        {/* Key Metrics Section */}
        <div className="mb-5">
          <h4 className="section-title mb-3">Inventory Overview</h4>
          <Row className="g-3">
            <Col md={6} lg={3}>
              <Card className="metric-card primary">
                <Card.Body>
                  <p className="metric-label">Total Products</p>
                  <h2 className="metric-value">{stats.totalStats.products}</h2>
                  <p className="metric-subtitle">In catalog</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card success">
                <Card.Body>
                  <p className="metric-label">In Stock</p>
                  <h2 className="metric-value">{stats.totalStats.inStock}</h2>
                  <ProgressBar now={stockPercentage} label={`${stockPercentage}%`} className="mt-2" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card danger">
                <Card.Body>
                  <p className="metric-label">Out of Stock</p>
                  <h2 className="metric-value">{stats.totalStats.outOfStock}</h2>
                  <p className="metric-subtitle">{((stats.totalStats.outOfStock / stats.totalStats.products) * 100).toFixed(1)}% of total</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card info">
                <Card.Body>
                  <p className="metric-label">Categories</p>
                  <h2 className="metric-value">{stats.totalStats.categories}</h2>
                  <p className="metric-subtitle">Product types</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Pricing Metrics */}
        <div className="mb-5">
          <h4 className="section-title mb-3">Pricing Analytics</h4>
          <Row className="g-3">
            <Col md={6} lg={3}>
              <Card className="metric-card">
                <Card.Body className="text-center">
                  <p className="metric-label">Average Price</p>
                  <h3 className="metric-price">${stats.totalStats.avgPrice}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card">
                <Card.Body className="text-center">
                  <p className="metric-label">Minimum Price</p>
                  <h3 className="metric-price">${stats.totalStats.minPrice}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card">
                <Card.Body className="text-center">
                  <p className="metric-label">Maximum Price</p>
                  <h3 className="metric-price">${stats.totalStats.maxPrice}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card highlight">
                <Card.Body className="text-center">
                  <p className="metric-label">Total Inventory Value</p>
                  <h3 className="metric-price">${stats.totalStats.totalValue}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Category Breakdown */}
        <Row className="mb-5">
          <Col lg={6}>
            <Card className="analytics-card">
              <Card.Header>
                <h5 className="mb-0">Products by Category</h5>
              </Card.Header>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Share</th>
                      <th>Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.categoryStats)
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([category, data]) => (
                        <tr key={category}>
                          <td className="category-name">{category}</td>
                          <td>
                            <span className="badge bg-primary">{data.count}</span>
                          </td>
                          <td>
                            <div className="mini-bar">
                              <div 
                                className="bar-fill" 
                                style={{ width: `${(data.count / stats.totalStats.products) * 100}%` }}
                              ></div>
                            </div>
                            <small>{((data.count / stats.totalStats.products) * 100).toFixed(1)}%</small>
                          </td>
                          <td>${data.avgPrice}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>

          {/* Embroidery Type Breakdown */}
          <Col lg={6}>
            <Card className="analytics-card">
              <Card.Header>
                <h5 className="mb-0">Products by Embroidery Type</h5>
              </Card.Header>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Count</th>
                      <th>Share</th>
                      <th>Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.embroideryStats)
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([type, data]) => (
                        <tr key={type}>
                          <td className="type-name">{type}</td>
                          <td>
                            <span className="badge bg-warning">{data.count}</span>
                          </td>
                          <td>
                            <div className="mini-bar">
                              <div 
                                className="bar-fill" 
                                style={{ width: `${(data.count / stats.totalStats.products) * 100}%` }}
                              ></div>
                            </div>
                            <small>{((data.count / stats.totalStats.products) * 100).toFixed(1)}%</small>
                          </td>
                          <td>${data.avgPrice}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Site Management */}
        <Row className="mt-5 g-3">
          <Col md={6} lg={3}>
            <Card className="info-card">
              <Card.Body className="text-center">
                <i className="fas fa-image icon-large"></i>
                <p className="mt-3">Site Images</p>
                <h3 className="number">{stats.totalStats.images}</h3>
                <p className="text-muted small">Uploaded</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Statistics;
