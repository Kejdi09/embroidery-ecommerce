import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ToastNotification from '../components/ToastNotification';
import './ContactMessages.css';

function ContactMessages() {
  const [authorized, setAuthorized] = useState(() => localStorage.getItem('adminAuthorized') === 'true');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    if (authorized) {
      fetchContacts();
    } else {
      setLoading(false);
    }
  }, [authorized]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts?limit=100');
      setContacts(response.data?.data || []);
    } catch (err) {
      console.error('Failed to load contacts', err);
      setToastMessage('Failed to load contact messages');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await api.delete(`/contacts/${id}`);
        setContacts(contacts.filter(c => c._id !== id));
        setToastMessage('Message deleted successfully');
        setToastVariant('success');
        setShowToast(true);
      } catch (err) {
        setToastMessage('Failed to delete message');
        setToastVariant('danger');
        setShowToast(true);
      }
    }
  };

  if (!authorized) {
    return (
      <Container className="py-5 text-center">
        <Card className="p-4">
          <h3 className="mb-3">Access Denied</h3>
          <p className="text-muted mb-4">Please login to admin first.</p>
          <Button as={Link} to="/admin" variant="primary">
            Go to Admin Dashboard
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <div className="contact-messages-page">
      <Container className="py-5">
        {/* Header */}
        <div className="page-header mb-4">
          <h1 className="admin-title">Contact Messages</h1>
          <Button as={Link} to="/admin" variant="outline-secondary">
            Back to Dashboard
          </Button>
        </div>

        <ToastNotification 
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
          variant={toastVariant}
        />

        {loading ? (
          <div className="loading-container text-center">
            <Spinner animation="border" />
            <p className="mt-3">Loading messages...</p>
          </div>
        ) : contacts.length === 0 ? (
          <Card className="p-5 text-center">
            <h4 className="text-muted">No contact messages yet</h4>
            <p className="text-muted">Messages will appear here when customers contact you.</p>
          </Card>
        ) : (
          <Card className="messages-card">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(contact => (
                    <React.Fragment key={contact._id}>
                      <tr
                        onClick={() =>
                          setExpandedId(expandedId === contact._id ? null : contact._id)
                        }
                        className="clickable-row"
                      >
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                        <td>{new Date(contact.createdAt).toLocaleString()}</td>
                        <td>
                          <Button
                            variant="sm"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contact._id);
                            }}
                            className="btn-danger-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                      {expandedId === contact._id && (
                        <tr>
                          <td colSpan="5">
                            <div className="message-detail">
                              <h6>Message:</h6>
                              <p>{contact.message}</p>
                              <div className="contact-info">
                                <p>
                                  <strong>Email:</strong>{' '}
                                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                                </p>
                                <p>
                                  <strong>Phone:</strong>{' '}
                                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default ContactMessages;
