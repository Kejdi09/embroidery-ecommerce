const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true, // e.g., 'hero', 'about', 'logo', 'footer'
    index: true
  },
  imageData: {
    type: String,
    required: true // base64 encoded image
  },
  contentType: {
    type: String,
    required: true // e.g., 'image/jpeg', 'image/png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema);
