const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    en: {
      type: String,
      required: true,
      minlength: 10
    },
    fr: {
      type: String,
      required: true,
      minlength: 10
    },
    sq: {
      type: String,
      required: true,
      minlength: 10
    }
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  imageData: {
    type: Buffer
  },
  contentType: {
    type: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  embroideryType: {
    type: String,
    enum: ['Machine', 'Hand', 'Digital'],
    default: 'Machine'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
