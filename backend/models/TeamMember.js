const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
    sq: { type: String, required: true }
  },
  bio: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
    sq: { type: String, required: true }
  },
  imageData: {
    type: Buffer
  },
  contentType: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
