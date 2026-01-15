import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="custom-footer">
      <Container>
        <Row className="py-4">
          <Col md={4} className="footer-section">
            <h5 className="footer-title">{t('footerTitle')}</h5>
            <p className="footer-text">
              {t('footerDescription')}
            </p>
          </Col>
          
          <Col md={4} className="footer-section">
            <h5 className="footer-title">{t('quickLinks')}</h5>
            <ul className="footer-links">
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/about">{t('about')}</Link></li>
              <li><Link to="/contact">{t('contact')}</Link></li>
              <li><Link to="/admin">{t('admin')}</Link></li>
            </ul>
          </Col>
          
          <Col md={4} className="footer-section">
            <h5 className="footer-title">{t('contactInfo')}</h5>
            <div className="footer-contact">
              <p><i className="fas fa-envelope me-2"></i> {t('infoEmail')}</p>
              <p><i className="fas fa-phone me-2"></i> {t('infoPhone')}</p>
              <p><i className="fas fa-map-marker-alt me-2"></i> {t('infoAddress')}</p>
            </div>
            <div className="social-icons mt-3">
              <a href="#facebook" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#instagram" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#twitter" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#pinterest" className="social-icon"><i className="fab fa-pinterest"></i></a>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col className="text-center py-3 border-top border-secondary">
            <p className="footer-copyright mb-0">
              &copy; {currentYear} {t('footerTitle')}. {t('footerCopyright')}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
