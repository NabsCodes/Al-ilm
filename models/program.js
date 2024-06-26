const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: [{
    type: String,
    // You can define additional validations or enum values for the program type
  }],
  messageId: [{
    type: Schema.Types.ObjectId,
    ref: ['Message']
  }],
  participants: [{
    type: Schema.Types.ObjectId,
    ref: ['Pupil', 'Volunteer']
  }],
  docs: [{
    name: String,
    dateUploaded: {
      type: Date,
      default: Date.now
    },
    path: String
  }],
  targetDate: {
    type: Date,
    default: Date.now
  },
  thumbnail: String,
  goal: {
    type: Number,
    // required: true
  },
  raised: {
    type: Number,
    default: 0

  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  supervisors: [{
    type: Schema.Types.ObjectId,
    ref: 'User' // Assuming User model is used for supervisors
  }],
  objectives: {
    type: String,
    // You can adjust the type based on your requirements
  },
  mission: {
    type: String,
    // You can adjust the type based on your requirements
  },
  donors: [{
    email: String,
    amount: Number
  }],
  isActive: {
    type: String,
    enum: ['on', 'off'],
    default: 'off'
  },
  status: {
    type: String,
    enum: ['on', 'off',],
    default: 'off'
  },
  isDonation: {
    type: String,
    enum: ['on', 'off'],
    default: 'off'
  }
});

const Program = mongoose.model('Program', programSchema);

// Database functions
const fetchAllPrograms = async () => {
  try {
    const programs = await Program.find();
    return programs;
  } catch (error) {
    throw error;
  }
};

const fetchProgramById = async (programId) => {
  try {
    const program = await Program.findById(programId)
      .populate('participants')
      .populate('supervisors')
      .populate('donors');

    return program;
  } catch (error) {
    throw error;
  }
};

const updateProgram = async (programId, updatedProgramData) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(programId, updatedProgramData, { new: true });
    return updatedProgram;
  } catch (error) {
    throw error;
  }
};

const createProgram = async (newProgramData) => {
  try {
    const newProgram = new Program(newProgramData);
    const savedProgram = await newProgram.save();
    return savedProgram;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  Program,
  fetchAllPrograms,
  fetchProgramById,
  updateProgram,
  createProgram
};
