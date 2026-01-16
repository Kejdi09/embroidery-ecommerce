import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './Home.css';

function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState('');
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    try {
      const res = await api.get('/images/location/hero');
      setHeroImage(res.data);
    } catch (err) {
      setHeroImage(null);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      const productsData = response.data.data || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      setErrorKey('');
    } catch (err) {
      setErrorKey('loadError');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container className="wide-container">
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title">{t('heroTitle')}</h1>
              <p className="hero-subtitle">
                {t('heroSubtitle')}
              </p>
              <Link to="/">
                <Button variant="primary" size="lg" className="hero-btn">
                  {t('exploreCollection')}
                </Button>
              </Link>
            </Col>
            <Col lg={6} className="hero-image-col">
              <div className="hero-image-wrapper">
                <img 
                  src={heroImage ? `data:${heroImage.contentType};base64,${heroImage.imageData}` : "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600"} 
                  alt="Embroidery" 
                  className="hero-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <Container className="wide-container">
          <div className="section-header">
            <h2 className="section-title">{t('ourCollection')}</h2>
            <p className="section-subtitle">{t('browseProducts')}</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">{t('loadingProducts')}</p>
            </div>
          ) : errorKey ? (
            <Alert variant="danger" className="text-center">
              {t(errorKey)}
              <Button variant="primary" className="ms-3" onClick={fetchProducts}>
                {t('retry')}
              </Button>
            </Alert>
          ) : products.length === 0 ? (
            <Alert variant="info" className="text-center">
              {t('noProducts')}
            </Alert>
          ) : (
            <Row className="g-4">
              {products.map((product) => (
                <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                    <Card className="product-card h-100">
                      <div className="product-image-wrapper">
                        <Card.Img 
                          variant="top" 
                          src={product.imageUrl || (product.imageData ? `data:${product.contentType};base64,${product.imageData}` : '/placeholder.jpg')} 
                          alt={product.name}
                          className="product-image"
                          style={{ cursor: 'pointer' }}
                        />
                        {product.inStock ? (
                          <span className="stock-badge in-stock">{t('inStock')}</span>
                        ) : (
                          <span className="stock-badge out-stock">{t('outOfStock')}</span>
                        )}
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="product-title">{product.name}</Card.Title>
                        <Card.Text className="product-description">
                        {typeof product.description === 'string' ? product.description : (product.description[i18n.language] || product.description.en)}
                        </Card.Text>
                        <div className="product-meta">
                          <span className="product-category">{product.category}</span>
                          <span className="product-type">{product.embroideryType}</span>
                        </div>
                        <div className="product-footer mt-auto">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="view-btn"
                          >
                            {t('viewDetails')}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container className="wide-container">
          <div className="section-header">
            <h2 className="section-title">{t('whyChooseUs')}</h2>
            <p className="section-subtitle">{t('weOffer')}</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">✨</div>
                <h4>{t('machinePrecision')}</h4>
                <p>{t('machinePrecisionDesc')}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h4>{t('customDesigns')}</h4>
                <p>{t('customDesignsDesc')}</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">⭐</div>
                <h4>{t('premiumQuality')}</h4>
                <p>{t('premiumQualityDesc')}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;
