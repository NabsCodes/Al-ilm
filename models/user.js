const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  recordId: {
    type: Schema.Types.ObjectId,
    ref: 'Volunteer', // Assuming there's a Volunteer model to reference
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
