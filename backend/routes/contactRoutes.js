const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Validation middleware
const validateContactInput = (req, res, next) => {
  const { name, email, phone, message } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }

  if (!phone || phone.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

// CREATE - Add new contact message
router.post('/', validateContactInput, async (req, res) => {
  try {
    const contact = new Contact({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      phone: req.body.phone.trim(),
      message: req.body.message.trim()
    });
    
    const savedContact = await contact.save();
    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received successfully. We will contact you soon.',
      data: savedContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

// READ - Get all contact messages with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNum - 1) * pageSize;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const total = await Contact.countDocuments();

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
});

// READ - Get single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
});

// DELETE - Delete contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: contact
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
});

module.exports = router;
