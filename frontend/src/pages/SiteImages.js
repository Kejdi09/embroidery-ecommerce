import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './SiteImages.css';

const IMAGE_LOCATIONS = [
  // Hero banners
  { key: 'home-hero', label: 'Home Hero Banner' },
  { key: 'about-hero', label: 'About Hero Banner' },
  { key: 'contact-hero', label: 'Contact Hero Banner' },
  { key: 'products-hero', label: 'Products Hero Banner' },
  // Team members
  { key: 'about-team-1', label: 'Team Member 1 (Sarah Johnson)' },
  { key: 'about-team-2', label: 'Team Member 2 (Michael Chen)' },
  { key: 'about-team-3', label: 'Team Member 3 (Emily Rodriguez)' },
  // Footer & branding
  { key: 'footer-logo', label: 'Footer Logo/Brand Image' }
];

function SiteImages() {
	const [authorized, setAuthorized] = useState(() => localStorage.getItem('adminAuthorized') === 'true');
	const [credentials, setCredentials] = useState({ username: '', code: '' });
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertVariant, setAlertVariant] = useState('success');
	const [loading, setLoading] = useState(true);
	const [images, setImages] = useState({});
	const [uploading, setUploading] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState(IMAGE_LOCATIONS[0].key);
	const [displayName, setDisplayName] = useState('');
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState('');

	const ACCESS_USERNAME = 'admin';
	const ACCESS_CODE = '2468';

	useEffect(() => {
		if (authorized) {
			fetchImages();
		} else {
			setLoading(false);
		}
	}, [authorized]);

	const showAlertMessage = (message, variant = 'success') => {
		setAlertMessage(message);
		setAlertVariant(variant);
		setShowAlert(true);
		setTimeout(() => setShowAlert(false), 2500);
	};

	const fetchImages = async () => {
		try {
			setLoading(true);
			const results = await Promise.all(
				IMAGE_LOCATIONS.map(async ({ key }) => {
					try {
						const res = await api.get(`/images/location/${key}`);
						return [key, res.data?.data];
					} catch (err) {
						return [key, null];
					}
				})
			);
			setImages(Object.fromEntries(results));
		} catch (err) {
			showAlertMessage('Failed to load site images', 'danger');
		} finally {
			setLoading(false);
		}
	};

	const handleAuthSubmit = (e) => {
		e.preventDefault();
		if (credentials.username.trim() === ACCESS_USERNAME && credentials.code.trim() === ACCESS_CODE) {
			localStorage.setItem('adminAuthorized', 'true');
			setAuthorized(true);
			setLoading(true);
			showAlertMessage('Access granted', 'success');
		} else {
			showAlertMessage('Invalid credentials', 'danger');
		}
	};

	const handleFileChange = (file) => {
		setFile(file || null);
		setPreview(file ? URL.createObjectURL(file) : '');
	};

	const getImageSrc = (img) => {
		if (img?.imageData && img?.contentType) {
			return `data:${img.contentType};base64,${img.imageData}`;
		}
		return '';
	};

	const handleUpload = async () => {
		if (!file) {
			showAlertMessage('Please choose a file first', 'warning');
			return;
		}

		const formData = new FormData();
		formData.append('location', selectedLocation);
		formData.append('name', displayName || selectedLocation);
		formData.append('image', file);

		try {
			setUploading(true);
			await api.post('/images/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			showAlertMessage('Image updated');
			setFile(null);
			setPreview('');
			setDisplayName('');
			fetchImages();
		} catch (err) {
			console.error(err);
			showAlertMessage('Upload failed', 'danger');
		} finally {
			setUploading(false);
		}
	};

	if (!authorized) {
		return (
			<div className="site-images-page">
				<Container className="py-5">
					<Row className="justify-content-center">
						<Col md={6} lg={5}>
							<Card className="auth-card">
								<Card.Body>
									<h2 className="admin-title mb-3">Admin Access</h2>
									<p className="text-muted mb-4">Sign in to manage site imagery.</p>
									{showAlert && (
										<Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
											{alertMessage}
										</Alert>
									)}
									<Form onSubmit={handleAuthSubmit}>
										<Form.Group className="mb-3">
											<Form.Label>Username</Form.Label>
											<Form.Control
												type="text"
												value={credentials.username}
												onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
												placeholder="Enter username"
												required
											/>
										</Form.Group>
										<Form.Group className="mb-4">
											<Form.Label>Access Code</Form.Label>
											<Form.Control
												type="password"
												value={credentials.code}
												onChange={(e) => setCredentials(prev => ({ ...prev, code: e.target.value }))}
												placeholder="Enter access code"
												required
											/>
										</Form.Group>
										<Button type="submit" variant="primary" className="w-100">
											Unlock
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
		<div className="site-images-page">
			<Container className="py-5">
				<div className="page-header">
					<h1 className="admin-title">Site Images</h1>
					<div className="d-flex gap-2 align-items-center flex-wrap">
						<Button as={Link} to="/admin" variant="secondary">Back to Products</Button>
						<Button variant="outline-dark" onClick={fetchImages} disabled={loading}>
							Refresh
						</Button>
					</div>
				</div>

				{showAlert && (
					<Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
						{alertMessage}
					</Alert>
				)}

				{loading ? (
					<div className="loading-container">
						<Spinner animation="border" />
						<p className="mt-3">Loading images...</p>
					</div>
				) : (
					<>
						<Card className="mb-4 upload-card">
							<Card.Body>
								<Row className="g-3 align-items-end">
									<Col md={4}>
										<Form.Group>
											<Form.Label>Location</Form.Label>
											<Form.Select
												value={selectedLocation}
												onChange={(e) => setSelectedLocation(e.target.value)}
											>
												{IMAGE_LOCATIONS.map(({ key, label }) => (
													<option key={key} value={key}>{label}</option>
												))}
											</Form.Select>
										</Form.Group>
									</Col>
									<Col md={3}>
										<Form.Group>
											<Form.Label>Display Name (optional)</Form.Label>
											<Form.Control
												type="text"
												value={displayName}
												onChange={(e) => setDisplayName(e.target.value)}
												placeholder="e.g., Home Banner"
											/>
										</Form.Group>
									</Col>
									<Col md={3}>
										<Form.Group>
											<Form.Label>Image File</Form.Label>
											<Form.Control
												type="file"
												accept="image/*"
												onChange={(e) => handleFileChange(e.target.files?.[0])}
											/>
										</Form.Group>
									</Col>
									<Col md={2} className="d-flex align-items-end">
										<Button
											variant="warning"
											className="w-100"
											onClick={handleUpload}
											disabled={uploading}
										>
											{uploading ? 'Uploading...' : 'Upload'}
										</Button>
									</Col>
								</Row>
								{preview && (
									<div className="mt-3 d-flex align-items-center gap-3">
										<img src={preview} alt="Preview" className="site-image-preview small-preview" />
										<span className="text-muted small">Preview</span>
									</div>
								)}
							</Card.Body>
						</Card>

						<Table bordered hover responsive className="site-images-table">
							<thead>
								<tr>
									<th>Location</th>
									<th>Name</th>
									<th>Last Updated</th>
									<th>Preview</th>
								</tr>
							</thead>
							<tbody>
								{IMAGE_LOCATIONS.map(({ key, label }) => {
									const imgData = images[key];
									return (
										<tr key={key}>
											<td>{label}</td>
											<td>{imgData?.name || '—'}</td>
											<td>{imgData ? new Date(imgData.updatedAt).toLocaleString() : 'No image uploaded'}</td>
											<td>
												{imgData ? (
													<img src={getImageSrc(imgData)} alt={label} className="table-thumb" />
												) : (
													<span className="text-muted">None</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</>
				)}
			</Container>
		</div>
	);
}

export default SiteImages;
