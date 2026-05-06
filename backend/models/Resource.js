const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Family Law', 'Criminal Law', 'Property Law', 'Corporate Law', 'General']
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'pLawo Legal Team'
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
