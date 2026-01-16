import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Statistics.css';

function Statistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: [],
    contacts: [],
    images: [],
    lowStockProducts: [],
    outOfStockProducts: [],
    categoryStockBreakdown: {},
    pricingByCategory: {},
    recentlyAdded: [],
    highestPriced: [],
    lowestPriced: [],
    recentContacts: [],
    imagesByLocation: {},
    summaryStats: {
      totalProducts: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      recentContactsCount: 0,
      totalImages: 0
    }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [productsRes, contactsRes, imagesRes] = await Promise.all([
        api.get('/products?limit=500'),
        api.get('/contacts?limit=500'),
        api.get('/images/all')
      ]);

      const products = productsRes.data?.data || [];
      const contacts = contactsRes.data?.data || [];
      const images = imagesRes.data || [];

      // Low stock products (less than 5 units)
      const lowStockProducts = products.filter(p => p.inStock > 0 && p.inStock < 5).sort((a, b) => a.inStock - b.inStock);
      
      // Out of stock products
      const outOfStockProducts = products.filter(p => p.inStock === 0);

      // Category stock breakdown
      const categoryStockBreakdown = products.reduce((acc, p) => {
        if (!acc[p.category]) {
          acc[p.category] = { total: 0, inStock: 0, outOfStock: 0 };
        }
        acc[p.category].total += 1;
        if (p.inStock > 0) {
          acc[p.category].inStock += 1;
        } else {
          acc[p.category].outOfStock += 1;
        }
        return acc;
      }, {});

      // Pricing by category
      const pricingByCategory = products.reduce((acc, p) => {
        if (!acc[p.category]) {
          acc[p.category] = { prices: [], avg: 0, min: Infinity, max: 0, totalValue: 0 };
        }
        acc[p.category].prices.push(p.price);
        acc[p.category].min = Math.min(acc[p.category].min, p.price);
        acc[p.category].max = Math.max(acc[p.category].max, p.price);
        acc[p.category].totalValue += p.price * p.inStock;
        return acc;
      }, {});

      Object.keys(pricingByCategory).forEach(cat => {
        const prices = pricingByCategory[cat].prices;
        pricingByCategory[cat].avg = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
        pricingByCategory[cat].min = pricingByCategory[cat].min === Infinity ? 0 : pricingByCategory[cat].min.toFixed(2);
        pricingByCategory[cat].max = pricingByCategory[cat].max.toFixed(2);
        pricingByCategory[cat].totalValue = pricingByCategory[cat].totalValue.toFixed(2);
      });

      // Recently added products (last 30 days)
      const recentlyAdded = products
        .filter(p => {
          const createdDate = new Date(p.createdAt);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return createdDate > thirtyDaysAgo;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Highest and lowest priced products
      const highestPriced = products
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);

      const lowestPriced = products
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);

      // Recent contacts (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentContactsCount = contacts.filter(c => new Date(c.createdAt) > sevenDaysAgo).length;
      const recentContacts = contacts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Images by location
      const imagesByLocation = images.reduce((acc, img) => {
        acc[img.location] = (acc[img.location] || 0) + 1;
        return acc;
      }, {});

      // Total inventory value
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.inStock), 0).toFixed(2);

      setStats({
        products,
        contacts,
        images,
        lowStockProducts,
        outOfStockProducts,
        categoryStockBreakdown,
        pricingByCategory,
        recentlyAdded,
        highestPriced,
        lowestPriced,
        recentContacts,
        imagesByLocation,
        summaryStats: {
          totalProducts: products.length,
          totalValue,
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length,
          recentContactsCount,
          totalImages: images.length
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading statistics...</p>
      </Container>
    );
  }

  const locations = ['home-hero', 'about-hero', 'contact-hero', 'products-hero', 'about-team-1', 'about-team-2', 'about-team-3', 'footer-logo'];

  return (
    <div className="statistics-page">
      <Container fluid className="py-5">
        {/* Header */}
        <div className="page-header mb-5">
          <div>
            <h1 className="admin-title">Business Insights & Analytics</h1>
            <p className="subtitle">Real-time metrics to manage your store</p>
          </div>
          <Button as={Link} to="/admin" variant="outline-secondary">
            Back to Dashboard
          </Button>
        </div>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        {/* INVENTORY ALERTS SECTION */}
        <div className="mb-5">
          <h4 className="section-title mb-3">Inventory Alerts</h4>
          <Row className="g-3 mb-4">
            <Col md={6} lg={3}>
              <Card className={`alert-card alert-danger ${stats.summaryStats.outOfStockCount > 0 ? 'active' : ''}`}>
                <Card.Body>
                  <p className="alert-label">Out of Stock</p>
                  <h2 className="alert-value">{stats.summaryStats.outOfStockCount}</h2>
                  <p className="alert-subtitle">Need immediate action</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className={`alert-card alert-warning ${stats.summaryStats.lowStockCount > 0 ? 'active' : ''}`}>
                <Card.Body>
                  <p className="alert-label">Low Stock (&lt;5 units)</p>
                  <h2 className="alert-value">{stats.summaryStats.lowStockCount}</h2>
                  <p className="alert-subtitle">Reorder recommended</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card">
                <Card.Body>
                  <p className="metric-label">Total Products</p>
                  <h2 className="metric-value">{stats.summaryStats.totalProducts}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card highlight">
                <Card.Body>
                  <p className="metric-label">Inventory Value</p>
                  <h2 className="metric-price">${stats.summaryStats.totalValue}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Out of Stock Products */}
          {stats.outOfStockProducts.length > 0 && (
            <Card className="analytics-card mb-3">
              <Card.Header>
                <h5 className="mb-0">Out of Stock Products ({stats.outOfStockProducts.length})</h5>
              </Card.Header>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.outOfStockProducts.slice(0, 5).map(product => (
                      <tr key={product._id} className="stock-alert-row">
                        <td className="product-name">{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                          <Link to="/admin/products" className="action-link">Restock</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}

          {/* Low Stock Products */}
          {stats.lowStockProducts.length > 0 && (
            <Card className="analytics-card mb-3">
              <Card.Header>
                <h5 className="mb-0">Low Stock Products ({stats.lowStockProducts.length})</h5>
              </Card.Header>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockProducts.slice(0, 5).map(product => (
                      <tr key={product._id} className="low-stock-row">
                        <td className="product-name">{product.name}</td>
                        <td>{product.category}</td>
                        <td>
                          <Badge bg="warning" text="dark">{product.inStock}</Badge>
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}

          {/* Category Stock Breakdown */}
          <Card className="analytics-card">
            <Card.Header>
              <h5 className="mb-0">Stock by Category</h5>
            </Card.Header>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total</th>
                    <th>In Stock</th>
                    <th>Out of Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.categoryStockBreakdown).map(([category, data]) => (
                    <tr key={category}>
                      <td className="category-name">{category}</td>
                      <td>{data.total}</td>
                      <td>
                        <Badge bg="success">{data.inStock}</Badge>
                      </td>
                      <td>
                        {data.outOfStock > 0 ? (
                          <Badge bg="danger">{data.outOfStock}</Badge>
                        ) : (
                          <span className="text-muted">0</span>
                        )}
                      </td>
                      <td>
                        {data.outOfStock > 0 ? (
                          <span className="status-alert">⚠️ Alert</span>
                        ) : (
                          <span className="status-good">✓ Good</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>

        {/* PRICING ANALYTICS SECTION */}
        <div className="mb-5">
          <h4 className="section-title mb-3">Pricing Analytics</h4>
          <Card className="analytics-card">
            <Card.Header>
              <h5 className="mb-0">Pricing by Category</h5>
            </Card.Header>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Avg Price</th>
                    <th>Min Price</th>
                    <th>Max Price</th>
                    <th>Inventory Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.pricingByCategory).map(([category, data]) => (
                    <tr key={category}>
                      <td className="category-name">{category}</td>
                      <td className="price-highlight">${data.avg}</td>
                      <td>${data.min}</td>
                      <td>${data.max}</td>
                      <td className="price-total">${data.totalValue}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>

          <Row className="g-3 mt-3">
            <Col lg={6}>
              <Card className="analytics-card">
                <Card.Header>
                  <h5 className="mb-0">Highest Priced Products</h5>
                </Card.Header>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.highestPriced.map(product => (
                        <tr key={product._id}>
                          <td className="product-name">{product.name}</td>
                          <td className="price-highlight">${product.price.toFixed(2)}</td>
                          <td>
                            {product.inStock > 0 ? (
                              <Badge bg="success">{product.inStock}</Badge>
                            ) : (
                              <Badge bg="danger">Out</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="analytics-card">
                <Card.Header>
                  <h5 className="mb-0">Lowest Priced Products</h5>
                </Card.Header>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.lowestPriced.map(product => (
                        <tr key={product._id}>
                          <td className="product-name">{product.name}</td>
                          <td className="price-highlight">${product.price.toFixed(2)}</td>
                          <td>
                            {product.inStock > 0 ? (
                              <Badge bg="success">{product.inStock}</Badge>
                            ) : (
                              <Badge bg="danger">Out</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* PRODUCT INSIGHTS SECTION */}
        {stats.recentlyAdded.length > 0 && (
          <div className="mb-5">
            <h4 className="section-title mb-3">Product Insights</h4>
            <Card className="analytics-card">
              <Card.Header>
                <h5 className="mb-0">Recently Added (Last 30 Days)</h5>
              </Card.Header>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentlyAdded.map(product => (
                      <tr key={product._id}>
                        <td className="product-name">{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                          <Badge bg={product.inStock > 0 ? 'success' : 'danger'}>
                            {product.inStock}
                          </Badge>
                        </td>
                        <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {/* CUSTOMER INSIGHTS SECTION */}
        <div className="mb-5">
          <h4 className="section-title mb-3">Customer Insights</h4>
          <Row className="g-3 mb-4">
            <Col md={6} lg={3}>
              <Card className="metric-card">
                <Card.Body>
                  <p className="metric-label">New Contacts (7 Days)</p>
                  <h2 className="metric-value">{stats.summaryStats.recentContactsCount}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="metric-card">
                <Card.Body>
                  <p className="metric-label">Total Messages</p>
                  <h2 className="metric-value">{stats.contacts.length}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {stats.recentContacts.length > 0 && (
            <Card className="analytics-card">
              <Card.Header>
                <h5 className="mb-0">Recent Messages</h5>
              </Card.Header>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message Preview</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentContacts.slice(0, 5).map(contact => (
                      <tr key={contact._id}>
                        <td className="product-name">{contact.name}</td>
                        <td>{contact.email}</td>
                        <td className="text-muted text-truncate" style={{ maxWidth: '200px' }}>
                          {contact.message.substring(0, 40)}...
                        </td>
                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to="/admin/contacts" className="action-link">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}
        </div>

        {/* SITE CONTENT SECTION */}
        <div className="mb-5">
          <h4 className="section-title mb-3">Site Content</h4>
          <Card className="metric-card">
            <Card.Body>
              <p className="metric-label">Total Images Uploaded</p>
              <h2 className="metric-value">{stats.summaryStats.totalImages}</h2>
            </Card.Body>
          </Card>

          <Card className="analytics-card mt-3">
            <Card.Header>
              <h5 className="mb-0">Images by Location</h5>
            </Card.Header>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map(location => {
                    const count = stats.imagesByLocation[location] || 0;
                    return (
                      <tr key={location}>
                        <td className="location-name">{location}</td>
                        <td>
                          {count > 0 ? (
                            <Badge bg="success">✓ Uploaded</Badge>
                          ) : (
                            <Badge bg="danger">✗ Missing</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Statistics;
