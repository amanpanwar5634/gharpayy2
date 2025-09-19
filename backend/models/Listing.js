const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  photos: [{ type: String }], 
  status: {
    type: String,
    enum: ['open', 'not_open'],
    default: 'open',
  },
  openDate: { type: String, default: 'NA' }, 
  gender: {
    type: String,
    enum: ['M', 'F', 'Coed'],
    required: true,
  },
  propType: {
    type: String,
    enum: ['ADVANTAGE' , 'BASIC PLUS', 'CLASSICS', 'LUXE MAX'],
    required: true,
  },
  amenities: {
    kitchenEssentials: [{ type: String }], 
    utilities: [{ type: String }], 
    comfort: [{ type: String }], 
    facilities: [{ type: String }], 
    security: [{ type: String }], 
    additional: [{ type: String }], 
  },
  disabled: {type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', listingSchema);
