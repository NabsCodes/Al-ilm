const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    goal: {
        type: Number,
        required: true
    },
    raised_amount: {
        type: Number,
        default: 0
    },
    location: String
});

const Cause = mongoose.model('Cause', causeSchema);

module.exports = Cause;
