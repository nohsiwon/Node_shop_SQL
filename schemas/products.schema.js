const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  author: {
    type: String,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    enum: ['FOR_SALE', 'SOLD_OUT'],
    default: 'FOR_SALE',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('products', productSchema);
