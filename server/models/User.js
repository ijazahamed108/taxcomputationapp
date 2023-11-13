const mongoose = require('mongoose');

// schema for user on baording
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['taxpayer', 'taxaccountant', 'admin'], default: 'taxpayer' },
  state:{ type: String },
  country:{ type: String, enum: ['india'] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
