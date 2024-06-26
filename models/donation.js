// donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Define your donation schema fields here
  amount: Number,
  d_email: {
    type: String
  }, 
  d_name: {
    type: String
  },
  d_phone: String,
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program', // Assuming User model is used for donors
  },
  d_date: {
    type: Date,
    default: Date.now()
  },
  payment_method: String,

  
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
