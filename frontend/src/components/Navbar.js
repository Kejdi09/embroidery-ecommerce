import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

function Navigation() {
  const { getCartItemsCount } = useCart();
  const { t } = useTranslation();

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="fas fa-tshirt me-2"></i>
          {t('brandLogo')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              {t('home')}
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">
              {t('about')}
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link-custom">
              {t('contact')}
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="nav-link-custom cart-link">
              <i className="fas fa-shopping-cart me-1"></i>
              {t('cart')}
              {getCartItemsCount() > 0 && (
                <Badge bg="primary" className="ms-2">
                  {getCartItemsCount()}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/admin" className="nav-link-custom admin-link">
              {t('admin')}
            </Nav.Link>
          </Nav>
          <div className="ms-3">
            <LanguageSwitcher />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
