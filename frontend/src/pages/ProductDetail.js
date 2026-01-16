import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { ProductCardSkeleton } from '../components/Skeleton';
import './ProductDetail.css';

function ProductDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const getImageSrc = (item) => {
    if (item?.imageData && item?.contentType) {
      return `data:${item.contentType};base64,${item.imageData}`;
    }
    return item?.imageUrl || 'https://via.placeholder.com/400?text=No+Image';
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
      setError('');
    } catch (err) {
      setError(t('loadError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return <ProductCardSkeleton />;
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || t('noProducts')}</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>
          {t('continueShopping')}
        </Button>
      </Container>
    );
  }

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate('/')} className="back-button">
        <span>← {t('back')}</span>
      </button>

      {addedToCart && (
        <Alert variant="success" className="cart-alert" dismissible onClose={() => setAddedToCart(false)}>
          ✓ {t('productCreated')}
        </Alert>
      )}

      <Container className="product-container">
        <Row className="product-row">
          {/* LEFT: Product Image */}
          <Col lg={5} className="image-col">
            <div className="image-frame">
              <div className="image-background"></div>
              <div className="product-image-wrapper">
                <img src={getImageSrc(product)} alt={product.name} className="product-image-display" />
              </div>
            </div>
          </Col>

          {/* RIGHT: Product Details */}
          <Col lg={7} className="details-col">
            <div className="details-wrapper">
              {/* Product Title and Status */}
              <div className="product-header">
                <h1 className="product-name">{product.name}</h1>
                <div className="status-badges">
                  <span className="badge-cat">{product.category}</span>
                  <span className="badge-type">{product.embroideryType}</span>
                  {product.inStock ? (
                    <span className="badge-available">{t('inStock')}</span>
                  ) : (
                    <span className="badge-unavailable">{t('outOfStock')}</span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="divider"></div>

              {/* Price Section */}
              <div className="price-section">
                <span className="price-label">{t('price')}</span>
                <span className="price-value">${product.price.toFixed(2)}</span>
              </div>

              {/* Description */}
              <div className="description-section">
                <h5 className="section-title">{t('description')}</h5>
                <p className="description-text">{typeof product.description === 'string' ? product.description : (product.description[i18n.language] || product.description.en)}</p>
              </div>

              {/* Features Box */}
              <div className="features-box">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">{t('premiumQualityEmbroidery')}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">{t('machinePrecisionCrafted')}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">{t('durableLongLasting')}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="info-section">
                <div className="info-row">
                  <span className="info-label">{t('category')}:</span>
                  <span className="info-value">{product.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{t('type')}:</span>
                  <span className="info-value">{product.embroideryType}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{t('stock')}:</span>
                  <span className="info-value">{product.inStock ? t('inStock') : t('outOfStock')}</span>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="action-section">
                <div className="quantity-box">
                  <label className="qty-label">{t('quantity')}:</label>
                  <div className="qty-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="qty-input"
                    />
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="add-cart-btn"
                >
                  🛒 {t('addToCart')}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductDetail;
