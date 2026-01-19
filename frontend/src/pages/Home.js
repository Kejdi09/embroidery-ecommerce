import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import CraftingProcess from '../components/CraftingProcess';
import './Home.css';

function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState('');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600');

  const getImageSrc = (item) => {
    if (item?.imageData && item?.contentType) {
      return `data:${item.contentType};base64,${item.imageData}`;
    }
    return item?.imageUrl || 'https://via.placeholder.com/300?text=No+Image';
  };

  useEffect(() => {
    fetchProducts();
    fetchHero();
  }, []);

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

  const fetchHero = async () => {
    try {
      const response = await api.get('/images/location/home-hero');
      const img = response.data?.data;
      if (img?.imageData && img?.contentType) {
        setHeroImage(`data:${img.contentType};base64,${img.imageData}`);
      }
    } catch (err) {
      // Fallback to default hero image
      console.warn('Hero image not found, using default.');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container className="wide-container">
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <span className="hero-label">{t('handcraftedLabel')}</span>
              <h1 className="hero-title">{t('heroMainTitle')}</h1>
              <p className="hero-subtitle">
                {t('heroMainSubtitle')}
              </p>
              <div className="hero-cta-group">
                <Link to="/">
                  <Button className="hero-cta-primary">
                    {t('shopNow')}
                  </Button>
                </Link>
                <Link to="/about">
                  <Button className="hero-cta-secondary">
                    {t('learnMore')}
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6} className="hero-image-col">
              <div className="hero-image-wrapper">
                <img 
                  src={heroImage}
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
                  <Card className="product-card">
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div className="product-image-wrapper">
                        <Card.Img 
                          variant="top" 
                          src={getImageSrc(product)} 
                          alt={product.name}
                          className="product-image"
                        />
                        {product.inStock ? (
                          <span className="stock-badge in-stock">{t('inStock')}</span>
                        ) : (
                          <span className="stock-badge out-stock">{t('outOfStock')}</span>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title className="product-title">{product.name}</Card.Title>
                        <Card.Text className="product-description">
                          {typeof product.description === 'string' ? product.description : (product.description[i18n.language] || product.description.en)}
                        </Card.Text>
                        <div className="product-meta">
                          <span className="product-category">{product.category}</span>
                          <span className="product-type">{product.embroideryType}</span>
                        </div>
                        <div className="product-footer">
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
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Crafting Process Carousel */}
      <CraftingProcess />
    </div>
  );
}

export default Home;
