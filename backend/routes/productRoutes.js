const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/Product');

const upload = multer({ storage: multer.memoryStorage() });

// Validation middleware
const validateProductInput = (req, res, next) => {
  const { name, price, category } = req.body;
  let description = req.body.description;
  
  const errors = [];

  // Accept JSON string payloads from multipart/form-data
  if (typeof description === 'string') {
    try {
      description = JSON.parse(description);
      req.body.description = description;
    } catch (e) {
      errors.push('Description must be valid JSON');
    }
  }
  
  if (!name || name.trim().length < 3) {
    errors.push('Product name must be at least 3 characters');
  }
  
  // Validate descriptions for all languages
  if (!description || typeof description !== 'object') {
    errors.push('Description object is required');
  } else {
    if (!description.en || typeof description.en !== 'string' || description.en.trim().length < 10) {
      errors.push('English description must be at least 10 characters');
    }
    if (!description.fr || typeof description.fr !== 'string' || description.fr.trim().length < 10) {
      errors.push('French description must be at least 10 characters');
    }
    if (!description.sq || typeof description.sq !== 'string' || description.sq.trim().length < 10) {
      errors.push('Albanian description must be at least 10 characters');
    }
  }
  
  if (!price || isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number');
  }
  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }
  // On create, require an image file
  if (req.method === 'POST') {
    if (!req.file) {
      errors.push('Image file is required');
    }
  }
  
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    console.error('Received data:', { name, description, price, category, hasFile: !!req.file });
    return res.status(400).json({ success: false, errors });
  }
  
  next();
};

// CREATE - Add new product
router.post('/', upload.single('image'), validateProductInput, async (req, res) => {
  try {
    const description = typeof req.body.description === 'string'
      ? JSON.parse(req.body.description)
      : req.body.description;

    const product = new Product({
      name: req.body.name,
      description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      inStock: parseInt(req.body.inStock) || 0,
      embroideryType: req.body.embroideryType || 'Machine',
      imageUrl: req.body.imageUrl || null,
      imageData: req.file ? req.file.buffer : undefined,
      contentType: req.file ? req.file.mimetype : undefined
    });
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: serializeProduct(savedProduct)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// READ - Get all products with search, filter, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, inStock, sortBy, page = 1, limit = 12 } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.fr': { $regex: search, $options: 'i' } },
        { 'description.sq': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by stock
    if (inStock === 'true') {
      query.inStock = true;
    } else if (inStock === 'false') {
      query.inStock = false;
    }
    
    // Sorting
    let sortQuery = {};
    switch (sortBy) {
      case 'price-asc':
        sortQuery = { price: 1 };
        break;
      case 'price-desc':
        sortQuery = { price: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'name':
        sortQuery = { name: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 12;
    const skip = (pageNum - 1) * pageSize;
    
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(pageSize);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products.map(serializeProduct),
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
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// READ - Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// READ - Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: serializeProduct(product)
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// UPDATE - Update product by ID
router.put('/:id', upload.single('image'), validateProductInput, async (req, res) => {
  try {
    const description = typeof req.body.description === 'string'
      ? JSON.parse(req.body.description)
      : req.body.description;

    const update = {
      name: req.body.name,
      description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      inStock: parseInt(req.body.inStock) || 0,
      embroideryType: req.body.embroideryType || 'Machine'
    };

    if (typeof req.body.imageUrl !== 'undefined') {
      update.imageUrl = req.body.imageUrl || null;
    }

    if (req.file) {
      update.imageData = req.file.buffer;
      update.contentType = req.file.mimetype;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: serializeProduct(product)
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// DELETE - Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: serializeProduct(product)
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

function serializeProduct(product) {
  if (!product) return product;
  const obj = product.toObject({ getters: true, virtuals: false });
  if (obj.imageData) {
    obj.imageData = obj.imageData.toString('base64');
  }
  return obj;
}

module.exports = router;
