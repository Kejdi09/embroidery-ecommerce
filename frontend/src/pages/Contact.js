import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ToastNotification from '../components/ToastNotification';
import './Contact.css';

function Contact() {
  const { t } = useTranslation();
  const [headerImage, setHeaderImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchHeaderImage = async () => {
      try {
        const res = await api.get('/images/location/contact-hero');
        const img = res.data?.data;
        if (img?.imageData && img?.contentType) {
          setHeaderImage(`data:${img.contentType};base64,${img.imageData}`);
        }
      } catch (err) {
        // Use background color fallback
      }
    };
    fetchHeaderImage();
  }, []);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = t('phoneInvalid');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('messageMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      const response = await api.post('/contacts', formData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (error) {
      setShowError(true);
      setErrorMessage(error.response?.data?.message || t('error'));
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Contact Header */}
      <section className="contact-header" style={headerImage ? { backgroundImage: `url('${headerImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h1 className="contact-title">{t('getInTouch')}</h1>
              <p className="contact-subtitle">
                {t('contactSubtitle')}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <Container>
          <Row className="g-4">
            {/* Contact Form */}
            <Col lg={7}>
              <Card className="contact-form-card">
                <Card.Body>
                  <h3 className="form-title">{t('sendUsMessage')}</h3>
                  
                  <ToastNotification 
                    show={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    message={t('successMessage')}
                    variant="success"
                  />

                  <ToastNotification 
                    show={showError}
                    onClose={() => setShowError(false)}
                    message={errorMessage}
                    variant="danger"
                  />

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>{t('name')} <span className="required">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('name')}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        className="custom-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>{t('email')} <span className="required">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        placeholder={t('email')}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        className="custom-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>{t('phone')} <span className="required">*</span></Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder={t('phone')}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                        className="custom-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMessage">
                      <Form.Label>{t('message')} <span className="required">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder={t('message')}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        isInvalid={!!errors.message}
                        className="custom-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                      variant="warning" 
                      type="submit" 
                      className="submit-btn w-100"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {t('loading')}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          {t('send')}
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Information */}
            <Col lg={5}>
              <Card className="contact-info-card mb-4">
                <Card.Body>
                  <h3 className="info-title">{t('contactInfo')}</h3>
                  <div className="contact-info-item">
                    <div className="info-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="info-content">
                      <h5>Address</h5>
                      <p>{t('infoAddress')}</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="info-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="info-content">
                      <h5>{t('phone')}</h5>
                      <p>{t('infoPhone')}</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="info-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="info-content">
                      <h5>{t('email')}</h5>
                      <p>{t('infoEmail')}</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="info-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="info-content">
                      <h5>Business Hours</h5>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                         Saturday: 10:00 AM - 4:00 PM<br />
                         Sunday: Closed</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="map-card">
                <Card.Body className="p-0">
                  <div className="map-placeholder">
                    <iframe
                      title="Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986548248684!3d40.697149422986005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Contact;
