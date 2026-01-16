const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/Image');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload site image (hero, about, logo, etc.)
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name, location } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    // Convert buffer to base64
    const imageData = req.file.buffer.toString('base64');

    // Check if image with this location already exists
    let image = await Image.findOne({ location });
    
    if (image) {
      // Update existing image
      image.name = name;
      image.imageData = imageData;
      image.contentType = req.file.mimetype;
      image.updatedAt = Date.now();
      await image.save();
    } else {
      // Create new image
      image = new Image({
        name,
        location,
        imageData,
        contentType: req.file.mimetype
      });
      await image.save();
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageId: image._id,
      location: image.location
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Get image by location
router.get('/location/:location', async (req, res) => {
  try {
    const image = await Image.findOne({ location: req.params.location });
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      id: image._id,
      name: image.name,
      location: image.location,
      imageData: image.imageData,
      contentType: image.contentType
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
});

// Get all site images
router.get('/all', async (req, res) => {
  try {
    const images = await Image.find().select('-imageData');
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error: error.message });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

module.exports = router;
