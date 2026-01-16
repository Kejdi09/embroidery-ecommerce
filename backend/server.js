const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//trigger
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/embroidery_db')
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.log('MongoDB Connection Error:', err));

// Import Routes
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/images', imageRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Embroidery E-commerce API is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

server.on('error', (error) => {
  console.error('Server Error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
