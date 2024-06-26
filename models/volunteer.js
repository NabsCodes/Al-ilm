const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    f_name: {
        type: String,
        required: true
    },
    s_name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        // required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
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
        }
    },
    phone: {
        type: String,
        required: true
    
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
   program:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        active: {
            type: Boolean,
            default: false
        }
   }],
    profession: {
        type: String,
        required: true
    },
    j_title: {
        type: String
    }, 
    self_statement: String,
    v_work: String,
    pupils: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pupil', // Assuming there's a Volunteer model to reference
    }],
    supervisor: {
        type: String
    },
    dateReg: {
        type: Date,
        default: Date.now()
    },
    personalDoc: [{
        docName: String,
        docPath: String,
    }],
    status: {
        type: String,
        enum: ['Pending', 'Approved'],
        default: 'Pending'
    },
    contacts:[ {
        c_name: {
            type: String
        },
        c_relation: {
            type: String
        },
        c_contact: {
            type: String
        },
        c_type:  {
            type: String
        }
    }],
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
