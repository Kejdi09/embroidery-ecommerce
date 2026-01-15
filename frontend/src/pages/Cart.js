import React from 'react';
import { Container, Row, Col, Button, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { t } = useTranslation();

  if (cart.length === 0) {
    return (
      <Container fluid className="cart-page py-5">
        <Row className="justify-content-center wide-container">
          <Col lg={8} className="text-center">
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h2>{t('cartEmpty')}</h2>
              <p>{t('cartEmptyDescription')}</p>
              <Link to="/">
                <Button variant="primary" size="lg">
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="cart-page py-5">
      <div className="wide-container">
        <h1 className="cart-title mb-4">{`${t('shoppingCart')} (${cart.length} ${t('items')})`}</h1>

        <Row className="gap-4">
        <Col lg={8}>
          <Card className="cart-items-card">
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>{t('product')}</th>
                    <th>{t('price')}</th>
                    <th>{t('quantity')}</th>
                    <th>{t('total')}</th>
                    <th>{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item._id}>
                      <td>
                        <div className="cart-product-info">
                          <img src={item.imageUrl} alt={item.name} />
                          <div>
                            <Link to={`/product/${item._id}`} className="product-name-link">
                              {item.name}
                            </Link>
                            <p className="text-muted">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <div className="quantity-input">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                            min="1"
                          />
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                      </td>
                      <td className="total-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="cart-summary-card">
            <Card.Body>
              <h5>{t('orderSummary')}</h5>
              <div className="summary-section">
                <div className="summary-row">
                  <span>{t('subtotal')}:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>{t('shipping')}:</span>
                  <span>{t('free')}</span>
                </div>
                <div className="summary-row">
                  <span>{t('tax')}:</span>
                  <span>{t('calculatedAtCheckout')}</span>
                </div>
              </div>
              <div className="summary-total">
                <span>{t('total')}:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="button-group">
                <Link to="/">
                  <Button variant="outline-primary" className="w-100">
                    {t('continueShopping')}
                  </Button>
                </Link>
                <Button variant="primary" className="w-100" disabled>
                  {t('proceedCheckoutDemo')}
                </Button>
                <Button 
                  variant="outline-danger" 
                  className="w-100"
                  onClick={clearCart}
                >
                  {t('clearCart')}
                </Button>
              </div>
              <p className="text-muted text-center mt-3">
                *{t('checkoutNote')}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>
    </Container>
  );
}

export default Cart;
