import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import './ToastNotification.css';

function ToastNotification({ show, onClose, message, variant = 'success', autohide = true, delay = 3000 }) {
  return (
    <ToastContainer position="top-end" className="p-3 toast-container-custom">
      <Toast 
        show={show} 
        onClose={onClose} 
        autohide={autohide}
        delay={delay}
        bg={variant}
        className="toast-custom"
      >
        <Toast.Header closeButton={true}>
          <strong className="me-auto">
            {variant === 'success' && '✓ Success'}
            {variant === 'danger' && '✕ Error'}
            {variant === 'warning' && '⚠ Warning'}
            {variant === 'info' && 'ℹ Info'}
          </strong>
        </Toast.Header>
        <Toast.Body className={variant === 'success' || variant === 'danger' || variant === 'warning' ? 'text-white' : ''}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNotification;
