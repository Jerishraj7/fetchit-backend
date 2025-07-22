const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  address: String,
  role: { type: String, default: 'customer' } // or 'admin'
});

module.exports = mongoose.model('User', userSchema);
