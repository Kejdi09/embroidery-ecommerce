import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form, Alert, Spinner, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './ProductManagement.css';

function ProductManagement() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [authorized, setAuthorized] = useState(() => localStorage.getItem('adminAuthorized') === 'true');
  const [credentials, setCredentials] = useState({ username: '', code: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const ACCESS_USERNAME = 'admin';
  const ACCESS_CODE = '2468';

  const [formData, setFormData] = useState({
    name: '',
    description: {
      en: '',
      fr: '',
      sq: ''
    },
    price: '',
    category: '',
    inStock: 0,
    embroideryType: 'Machine'
  });

  const getImageSrc = (product) => {
    if (product?.imageData && product?.contentType) {
      return `data:${product.contentType};base64,${product.imageData}`;
    }
    return product?.imageUrl || 'https://via.placeholder.com/150?text=No+Image';
  };

  const normalizeDescription = (desc) => {
    if (!desc) {
      return { en: '', fr: '', sq: '' };
    }
    if (typeof desc === 'string') {
      return { en: desc, fr: desc, sq: desc };
    }
    return {
      en: desc.en || '',
      fr: desc.fr || '',
      sq: desc.sq || ''
    };
  }; 

  useEffect(() => {
    if (authorized) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [authorized]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      // Backend returns { success: true, data: [...products] }
      const productsData = response.data.data || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      showAlertMessage(t('loadError'), 'danger');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const showAlertMessage = (message, variant = 'success') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditMode(true);
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: normalizeDescription(product.description),
        price: product.price,
        category: product.category,
        inStock: product.inStock,
        embroideryType: product.embroideryType
      });
      setImagePreview(getImageSrc(product));
      setImageFile(null);
    } else {
      setEditMode(false);
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: {
          en: '',
          fr: '',
          sq: ''
        },
        price: '',
        category: '',
        inStock: true,
        embroideryType: 'Machine'
      });
      setImageFile(null);
      setImagePreview('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentProduct(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'inStock' ? parseInt(value) || 0 : (type === 'checkbox' ? checked : value)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate descriptions
    if (!formData.description.en.trim() || formData.description.en.trim().length < 10) {
      showAlertMessage('English description must be at least 10 characters', 'danger');
      return;
    }
    if (!formData.description.fr.trim() || formData.description.fr.trim().length < 10) {
      showAlertMessage('French description must be at least 10 characters', 'danger');
      return;
    }
    if (!formData.description.sq.trim() || formData.description.sq.trim().length < 10) {
      showAlertMessage('Albanian description must be at least 10 characters', 'danger');
      return;
    }

    if (!editMode && !imageFile) {
      showAlertMessage('Please upload an image file', 'danger');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', JSON.stringify(formData.description));
    payload.append('price', formData.price);
    payload.append('category', formData.category);
    payload.append('inStock', formData.inStock);
    payload.append('embroideryType', formData.embroideryType);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editMode) {
        await api.put(`/products/${currentProduct._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showAlertMessage(t('productUpdated'), 'success');
      } else {
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showAlertMessage(t('productCreated'), 'success');
      }
      
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Full error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      let errorMsg = 'Failed to save product. ';
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMsg += error.response.data.errors.join(' | ');
      } else if (error.response?.data?.message) {
        errorMsg += error.response.data.message;
      } else if (error.message) {
        errorMsg += error.message;
      } else {
        errorMsg += 'Please check all fields and try again.';
      }
      
      showAlertMessage(errorMsg, 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      try {
        await api.delete(`/products/${id}`);
        showAlertMessage(t('productDeleted'), 'success');
        fetchProducts();
      } catch (error) {
        showAlertMessage(t('loadError'), 'danger');
      }
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (credentials.username.trim() === ACCESS_USERNAME && credentials.code.trim() === ACCESS_CODE) {
      localStorage.setItem('adminAuthorized', 'true');
      setAuthorized(true);
      setLoading(true);
      showAlertMessage(t('adminAccessGranted'), 'success');
    } else {
      showAlertMessage(t('invalidCredentials'), 'danger');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('adminAuthorized');
    setAuthorized(false);
    setCredentials({ username: '', code: '' });
    setProducts([]);
  };

  if (!authorized) {
    return (
      <div className="product-management-page">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="auth-card">
                <Card.Body>
                  <h2 className="admin-title mb-3">{t('adminAccessTitle')}</h2>
                  <p className="text-muted mb-4">{t('adminAccessSubtitle')}</p>
                  {showAlert && (
                    <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
                      {alertMessage}
                    </Alert>
                  )}
                  <Form onSubmit={handleAuthSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('username')}</Form.Label>
                      <Form.Control
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                        placeholder={t('username')}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>{t('accessCode')}</Form.Label>
                      <Form.Control
                        type="password"
                        value={credentials.code}
                        onChange={(e) => setCredentials(prev => ({ ...prev, code: e.target.value }))}
                        placeholder={t('accessCode')}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">
                      {t('unlock')}
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
    <div className="product-management-page">
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h1 className="admin-title">{t('productManagement')}</h1>
              <div className="header-buttons">
                <Button 
                  variant="warning" 
                  size="lg" 
                  onClick={() => handleShowModal()}
                  className="add-product-btn"
                >
                  <i className="fas fa-plus me-2"></i>
                  {t('addNewProduct')}
                </Button>
                <Button as={Link} to="/admin" variant="outline-secondary" className="ms-2">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <div className="loading-container">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3">{t('loadingProducts')}</p>
          </div>
        ) : (
          <Row>
            <Col>
              <div className="table-responsive">
                <Table striped bordered hover className="products-table">
                  <thead>
                    <tr>
                      <th>{t('image')}</th>
                      <th>{t('name')}</th>
                      <th>{t('description')}</th>
                      <th>{t('price')}</th>
                      <th>{t('category')}</th>
                      <th>{t('type')}</th>
                      <th>{t('stock')}</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          {t('noProductsRow')}
                        </td>
                      </tr>
                    ) : (
                      products.map(product => (
                        <tr key={product._id} className={`${product.inStock === 0 ? 'stock-out' : product.inStock < 5 ? 'stock-low' : ''}`}>
                          <td>
                            <img 
                              src={getImageSrc(product)} 
                              alt={product.name}
                              className="table-image"
                            />
                          </td>
                          <td>{product.name}</td>
                          <td className="description-cell">{typeof product.description === 'string' ? product.description : (product.description.en || JSON.stringify(product.description))}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>{product.category}</td>
                          <td>{product.embroideryType}</td>
                          <td>
                            <span className={`badge ${product.inStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {product.inStock > 0 ? `${t('inStockLabel')} (${product.inStock})` : t('outOfStockLabel')}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="me-2 mb-1"
                              onClick={() => handleShowModal(product)}
                            >
                              <i className="fas fa-edit"></i> {t('edit')}
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              className="mb-1"
                              onClick={() => handleDelete(product._id)}
                            >
                              <i className="fas fa-trash"></i> {t('delete')}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        )}

        {/* Add/Edit Product Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode ? t('updateProduct') : t('addNewProduct')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('name')} *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter product name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('price')} *</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Enter price"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>{t('description')} - English *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description.en}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, en: e.target.value }
                  }))}
                  required
                  placeholder="Enter product description in English"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('description')} - French *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description.fr}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, fr: e.target.value }
                  }))}
                  required
                  placeholder="Entrez la description du produit en français"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('description')} - Albanian *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description.sq}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, sq: e.target.value }
                  }))}
                  required
                  placeholder="Futni përshkrimin e produktit në shqip"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('category')} *</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="e.g., T-Shirts, Hoodies"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('embroideryType')} *</Form.Label>
                    <Form.Select
                      name="embroideryType"
                      value={formData.embroideryType}
                      onChange={handleChange}
                      required
                    >
                      <option value="Machine">Machine</option>
                      <option value="Hand">Hand</option>
                      <option value="Digital">Digital</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>{t('image')} *</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editMode}
                />
                {imagePreview && (
                  <div className="mt-3 d-flex align-items-center gap-3">
                    <img src={imagePreview} alt="Preview" className="table-image" />
                    <span className="text-muted small">Preview</span>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('inStockLabel')} (Quantity)</Form.Label>
                <Form.Control
                  type="number"
                  name="inStock"
                  value={formData.inStock}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter stock quantity"
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  {t('cancel')}
                </Button>
                <Button variant="warning" type="submit">
                  {editMode ? t('updateProduct') : t('createProduct')}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default ProductManagement;
