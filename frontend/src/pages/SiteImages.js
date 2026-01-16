import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const LOCATIONS = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'about-hero', label: 'About Hero' },
  { value: 'logo', label: 'Logo' },
  { value: 'footer', label: 'Footer' },
  { value: 'team-1', label: 'Team Member 1' },
  { value: 'team-2', label: 'Team Member 2' },
  { value: 'team-3', label: 'Team Member 3' }
];

function SiteImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, variant: 'success', message: '' });
  const [form, setForm] = useState({ name: '', location: 'hero' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/images/all');
      setImages(res.data || []);
    } catch (err) {
      console.error(err);
      setAlert({ show: true, variant: 'danger', message: 'Failed to load images' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setAlert({ show: true, variant: 'danger', message: 'Image must be under 5MB' });
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setAlert({ show: true, variant: 'danger', message: 'Please select an image file' });
      return;
    }
    try {
      const data = new FormData();
      data.append('name', form.name || form.location);
      data.append('location', form.location);
      data.append('image', file);
      await api.post('/images/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAlert({ show: true, variant: 'success', message: 'Image saved' });
      setFile(null);
      setPreview(null);
      setForm({ ...form, name: '' });
      fetchImages();
    } catch (err) {
      console.error(err);
      setAlert({ show: true, variant: 'danger', message: 'Upload failed' });
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Site Images</h2>
      <p className="text-muted">Upload fixed images (hero, about, logo, etc.)</p>

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Name (optional)</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Display name"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Image File</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Preview" style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }} />
              </div>
            )}
          </Col>
        </Row>
        <div className="mt-3">
          <Button type="submit" variant="primary">Save Image</Button>
        </div>
      </Form>

      <h5>Current Images</h5>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Location</th>
              <th>Name</th>
              <th>Preview</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {images.length === 0 ? (
              <tr><td colSpan="4" className="text-center">No images</td></tr>
            ) : (
              images.map((img) => (
                <tr key={img._id}>
                  <td>{img.location}</td>
                  <td>{img.name}</td>
                  <td>
                    <img
                      src={img.imageData ? `data:${img.contentType};base64,${img.imageData}` : '/placeholder.jpg'}
                      alt={img.name}
                      style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{new Date(img.updatedAt || img.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default SiteImages;
