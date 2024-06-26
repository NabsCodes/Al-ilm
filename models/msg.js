const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	s_name: {
		type: String,
		required: true,
	},
	s_email: {
		type: String,
		required: true,
	},
	s_message: {
		type: String,
		required: true,
	},
	s_phone: {
		type: String,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

const Message = mongoose.model('Msg', messageSchema);

module.exports = Message;
