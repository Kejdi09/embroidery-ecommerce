const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true, index: true },
    imageData: { type: Buffer, required: true },
    contentType: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);
