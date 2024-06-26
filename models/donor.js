const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    d_amount: {
        type: Number,
        required: true
    },
    d_date: {
        type: Date,
        default: Date.now
    }
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
