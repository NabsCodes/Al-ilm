const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	bio: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		required: true,
	},
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
