const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pupilSchema = new Schema({
    f_name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        default: 'Not on record'
    },
    s_name: {
        type: String,
        required: true
    },
    photo: String, // Assuming the photo is a URL or file path
    maiden_name: String,
    notes: [{
        text: String,
        created_at: {
            type: Date,
            default: Date.now
        }
    }],
    address: {
        number: {
        type:String,
        default: ''
        },
        street: {type:String,
        default: ''
        },
        city: {type:String,
        default: ''
        },
        zip: {type:String,
        default: ''
        },
        country:{
            type: String,
            default: ''
        },
    },
    guardian: {
        name: {
            type: String,
            default: 'Not on record'
        },
        phone: {
            type:String,
            default: 'Not on record'
        },
        address: {
            type:String,
            default: 'Not on record'
        },
        relation: {
            type:String,
            default: 'Not on record'
        }
        
    },
    nok: {
        name: {
            type: String,
            default: 'Not on record'
        },
        phone: {
            type:String,
            default: 'Not on record'
        },
        address: {
            type:String,
            default: 'Not on record'
        },
        relation: {
            type:String,
            default: 'Not on record'
        }
        
    },
    lk_address: String,
    
    school: {
        name: {
            type: String,
            default: 'Not on Record'
        },
        status: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        }
    },
    dob: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    gender: {
        type:String,
        enum: ['Male', 'Female']
    },
    programId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        default: 'Not Perticipating'
    }],
    phone: {
        type: String,
        default: 'Not on record'
    },
    registeredDate: {
        type: Date,
        default: Date.now()
    },
    supervisor:{
        type: String,
        default: 'Not Assigned'
    },
    contacts: [{
        c_name: {
            type: String,
            default: null
        },
        c_type: {
            type: String,
            default: null
        },
        c_contact: {
            type: String,
            default: null
        }
    }]
});


// Add a method to the schema to add a new contact to the pupil
pupilSchema.statics.addContactToPupil = async function (pupilId, newContactData) {
    try {
      // Fetch the pupil by ID
      const pupil = await this.findById(pupilId).exec();
  
      // Check if the pupil is not found
      if (!pupil) {
        throw new Error('Pupil not found');
      }
  
      // Add the new contact to the contacts array
      pupil.contacts.push(newContactData);
  
      // Save the updated pupil
      const updatedPupil = await pupil.save();
      
      return updatedPupil;
    } catch (error) {
      throw error;
    }
  };
  


const Pupil = mongoose.model('Pupil', pupilSchema);

module.exports = Pupil;
