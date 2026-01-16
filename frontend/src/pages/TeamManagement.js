import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form, Spinner, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ToastNotification from '../components/ToastNotification';
import './TeamManagement.css';

function TeamManagement() {
  const [authorized, setAuthorized] = useState(() => localStorage.getItem('adminAuthorized') === 'true');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    role_en: '', role_fr: '', role_sq: '',
    bio_en: '', bio_fr: '', bio_sq: '',
    order: 0,
    image: null
  });

  useEffect(() => {
    if (authorized) {
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, [authorized]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/team');
      setMembers(response.data?.data || []);
    } catch (err) {
      setToastMessage('Failed to load team members');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role_en: member.role.en,
        role_fr: member.role.fr,
        role_sq: member.role.sq,
        bio_en: member.bio.en,
        bio_fr: member.bio.fr,
        bio_sq: member.bio.sq,
        order: member.order || 0,
        image: null
      });
      if (member.imageData && member.contentType) {
        setImagePreview(`data:${member.contentType};base64,${member.imageData}`);
      }
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role_en: '', role_fr: '', role_sq: '',
        bio_en: '', bio_fr: '', bio_sq: '',
        order: members.length,
        image: null
      });
      setImagePreview('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({
      name_en: '', name_fr: '', name_sq: '',
      role_en: '', role_fr: '', role_sq: '',
      bio_en: '', bio_fr: '', bio_sq: '',
      order: 0,
      image: null
    });
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', JSON.stringify({
      en: formData.role_en,
      fr: formData.role_fr,
      sq: formData.role_sq
    }));
    data.append('bio', JSON.stringify({
      en: formData.bio_en,
      fr: formData.bio_fr,
      sq: formData.bio_sq
    }));
    data.append('order', formData.order);
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingMember) {
        await api.put(`/team/${editingMember._id}`, data);
        setToastMessage('Team member updated successfully');
      } else {
        await api.post('/team', data);
        setToastMessage('Team member added successfully');
      }
      setToastVariant('success');
      setShowToast(true);
      fetchMembers();
      handleCloseModal();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Operation failed');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this team member?')) {
      try {
        await api.delete(`/team/${id}`);
        setToastMessage('Team member deleted successfully');
        setToastVariant('success');
        setShowToast(true);
        fetchMembers();
      } catch (err) {
        setToastMessage('Failed to delete team member');
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
    <div className="team-management-page">
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="admin-title">Team Management</h1>
              <div>
                <Button onClick={() => handleOpenModal()} variant="primary" className="me-2">
                  Add Team Member
                </Button>
                <Button as={Link} to="/admin" variant="outline-secondary">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <ToastNotification 
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
          variant={toastVariant}
        />

        {loading ? (
          <div className="loading-container">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading team members...</p>
          </div>
        ) : (
          <Card>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name (EN)</th>
                  <th>Role (EN)</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member._id}>
                    <td>
                      {member.imageData && member.contentType ? (
                        <img 
                          src={`data:${member.contentType};base64,${member.imageData}`}
                          alt={member.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', background: '#ddd', borderRadius: '50%' }}></div>
                      )}
                    </td>
                    <td>{member.name}</td>
                    <td>{member.role.en}</td>
                    <td>{member.order}</td>
                    <td>
                      <Button 
                        size="sm" 
                        variant="warning" 
                        onClick={() => handleOpenModal(member)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger" 
                        onClick={() => handleDelete(member._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {members.length === 0 && (
              <div className="text-center p-5">
                <p className="text-muted">No team members yet. Add one to get started!</p>
              </div>
            )}
          </Card>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {imagePreview && (
                <div className="text-center mb-3">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '10px' }} />
                </div>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Team member name"
                  required
                />
              </Form.Group>

              <h5 className="mb-3">Role</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>English</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.role_en}
                      onChange={(e) => setFormData({...formData, role_en: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>French</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.role_fr}
                      onChange={(e) => setFormData({...formData, role_fr: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Albanian</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.role_sq}
                      onChange={(e) => setFormData({...formData, role_sq: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="mb-3">Bio</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>English</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.bio_en}
                      onChange={(e) => setFormData({...formData, bio_en: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>French</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.bio_fr}
                      onChange={(e) => setFormData({...formData, bio_fr: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Albanian</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.bio_sq}
                      onChange={(e) => setFormData({...formData, bio_sq: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Display Order</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                />
                <Form.Text className="text-muted">
                  Lower numbers appear first
                </Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingMember ? 'Update' : 'Add'} Team Member
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default TeamManagement;
