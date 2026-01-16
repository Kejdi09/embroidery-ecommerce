const express = require('express');
const multer = require('multer');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

const upload = multer({ storage: multer.memoryStorage() });

const serializeTeamMember = (member) => {
  const obj = member.toObject();
  if (obj.imageData) {
    obj.imageData = obj.imageData.toString('base64');
  }
  return obj;
};

// GET all team members
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json({
      success: true,
      data: members.map(serializeTeamMember)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching team members',
      error: error.message
    });
  }
});

// POST - Create team member
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, role, bio, order } = req.body;
    
    const memberData = {
      name: name,
      role: JSON.parse(role),
      bio: JSON.parse(bio),
      order: parseInt(order) || 0
    };

    if (req.file) {
      memberData.imageData = req.file.buffer;
      memberData.contentType = req.file.mimetype;
    }

    const member = new TeamMember(memberData);
    await member.save();

    res.status(201).json({
      success: true,
      data: serializeTeamMember(member),
      message: 'Team member created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating team member',
      error: error.message
    });
  }
});

// PUT - Update team member
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, role, bio, order } = req.body;
    
    const updateData = {
      name: name,
      role: JSON.parse(role),
      bio: JSON.parse(bio),
      order: parseInt(order) || 0
    };

    if (req.file) {
      updateData.imageData = req.file.buffer;
      updateData.contentType = req.file.mimetype;
    }

    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: serializeTeamMember(member),
      message: 'Team member updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating team member',
      error: error.message
    });
  }
});

// DELETE team member
router.delete('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting team member',
      error: error.message
    });
  }
});

module.exports = router;
