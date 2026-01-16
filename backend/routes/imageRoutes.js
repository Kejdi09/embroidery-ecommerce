const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload or replace image for a location
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    const payload = {
      name: name || location,
      location,
      imageData: req.file.buffer,
      contentType: req.file.mimetype
    };

    const saved = await Image.findOneAndUpdate({ location }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Get latest image for a location
router.get('/location/:location', async (req, res) => {
  try {
    const img = await Image.findOne({ location: req.params.location }).sort({ updatedAt: -1 });
    if (!img) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({
      success: true,
      data: {
        _id: img._id,
        name: img.name,
        location: img.location,
        updatedAt: img.updatedAt,
        imageData: img.imageData.toString('base64'),
        contentType: img.contentType
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching image' });
  }
});

// List all images (metadata only)
router.get('/all', async (_req, res) => {
  try {
    const images = await Image.find({}).sort({ updatedAt: -1 });
    res.json(images.map(img => ({
      _id: img._id,
      name: img.name,
      location: img.location,
      updatedAt: img.updatedAt,
      createdAt: img.createdAt
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching images' });
  }
});

module.exports = router;
