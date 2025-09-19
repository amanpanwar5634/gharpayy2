const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    adminType: {
      type: String,
      enum: ['super', 'regular'],
      required: true,
    },
  }
);

module.exports = mongoose.model('User', userSchema);
