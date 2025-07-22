const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // keep only cart id
  totalAmount: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
