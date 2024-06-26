const Volunteer = require('../models/volunteer'); // Adjust the path based on your project structure
const mongoose = require('mongoose');
const User = require('../models/user');
const Program = require('../models/program');
const Pupil = require('../models/pupil');
const Donation = require('../models/donation');
const TeamMember = require('../models/teamMembers');

const getdashboard = (req, res) => {
	res.render('dashboard');
};

const getPupils = async (req, res) => {
	try {
		// Fetch all pupil entries from the database
		const pupils = await Pupil.find();

		// Format dates to "dd/mm/yyyy"
		const formattedPupils = pupils.map((pupil) => {
			const formattedDOB = pupil.dob
				? pupil.dob.toLocaleDateString('en-US', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
				  })
				: 'Not Available';

			const formattedDateRegistered = pupil.registeredDate
				? pupil.registeredDate.toLocaleDateString('en-US', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
				  })
				: 'Not Available';

			return {
				...pupil.toObject(),
				formattedDOB,
				formattedDateRegistered,
			};
		});

		// Respond with the fetched and formatted pupil entries
		res.status(200).render('pupils', {
			pupils: formattedPupils,
		});
	} catch (error) {
		console.error('Error fetching and formatting pupils:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getPupilRecord = async (req, res) => {
	try {
		const pupilId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(pupilId)) {
			return res.status(400).json({ error: 'Invalid Pupil ID' });
		}

		// Fetch the pupil by ID from the database
		const pupil = await Pupil.findById(pupilId);

		// Check if the pupil is not found
		if (!pupil) {
			return res.status(404).json({ error: 'Pupil not found' });
		}

		// Format date of birth and date registered (similar to the getPupils function)
		const formattedDOB = pupil.dob
			? pupil.dob.toLocaleDateString('en-US', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
			  })
			: 'Not Available';

		const formattedDateRegistered = pupil.registeredDate
			? pupil.registeredDate.toLocaleDateString('en-US', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
			  })
			: 'Not Available';

		// console.log('pupil: ', pupil)
		// Respond with the fetched and formatted pupil entry
		res.status(200).render('record', {
			contacts: pupil.contacts || [], // Use the contacts array or an empty array if it's not available
			pupil: {
				...pupil.toObject(),
				formattedDOB,
				formattedDateRegistered,
			},
		});
	} catch (error) {
		console.error('Error fetching and formatting pupil record:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getvolunteers = async (req, res) => {
	const volunteer = await Volunteer.find();
	res.render('volunteer-list', {
		volunteer,
	});
};

const getVolunteerRecord = async (req, res) => {
	const { id } = req.params;

	try {
		// Check if the provided ID is a valid ObjectId before querying the database
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid volunteer ID format' });
		}

		// Find the volunteer by ID in the database
		const volunteer = await Volunteer.findById(id);

		// If volunteer not found, return 404 Not Found
		if (!volunteer) {
			return res.status(404).json({ error: 'Volunteer not found' });
		}

		const user = await User.findOne({ recordId: id });
		let isLocked = {};
		let isActive = {};
		if (!user) {
			isLocked = false;
			isActive = false;
			//   console.log('islocked: ', user)
		} else {
			isLocked = user.isLocked;
			isActive = user.isActive;
		}

		const contacts = volunteer.contacts;
		console.log('isActive: ', contacts);
		// Respond with the volunteer data
		res.status(200).render('profile', {
			volunteer,
			pageTitle: 'Volunteer | ' + volunteer.s_name,
			isLocked,
			isActive,
			user,
			contacts,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const { fetchAllPrograms, fetchProgramById, updateProgram, createProgram } = require('../models/program'); // Import the database functions

// Controller function to fetch all programs
const getAllPrograms = async (req, res) => {
	try {
		const programs = await fetchAllPrograms();
		console.log('This is your programs: ', programs);
		res.render('programs', {
			programs,
			pageTitle: 'Programs',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Controller function to fetch a single program by ID
const getProgramById = async (req, res) => {
	const { id } = req.params;
	try {
		const program = await fetchProgramById(id);
		console.log('this is body: ', program);

		if (!program) {
			return res.status(404).json({ error: 'Program not found' });
		}

		res.status(200).render('edit-program', {
			program1: program,
			pageTitle: program.title,
			types: program.type,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getDonations = async (req, res) => {
	try {
		// Fetch all donation entries from the database
		const donations = await Donation.find().populate('programId');
		const programsDonations = await Donation.find({ programId: { $ne: null } }).populate('programId');
		// Format all donations to include amount and date
		const formattedAllDonations = donations.map((donation) => {
			// Assuming your donation model has a field named amount representing the donation amount
			const formattedAmount = donation.amount.toLocaleString('en-US', {
				style: 'currency',
				currency: 'NGN', // You can adjust the currency code as needed
				minimumFractionDigits: 2,
			});

			// Format the date to "dd/mm/yyyy"
			const formattedDate = donation.d_date.toLocaleDateString('en-US', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});

			// Add the formatted amount and date to the donation object
			return {
				...donation.toObject(),
				formattedAmount,
				formattedDate,
			};
		});

		// Filter donations based on amount and format the amount to currency
		const currentDate = new Date();

		const filteredDonations = formattedAllDonations
			.filter((donation) => {
				// Assuming your donation model has a field named d_date representing the date and time
				const donationDate = new Date(donation.d_date);
				return donationDate <= currentDate; // Only include donations with date and time less than or equal to the current date and time
			})
			.slice(0, 5); // Limit to only five entries

		console.log('All Donations: ', formattedAllDonations);

		// Respond with the fetched and filtered donation entries
		res.status(200).render('donations', {
			donations: formattedAllDonations,
			recentDonations: filteredDonations,
			programsDonations,
		});
	} catch (error) {
		console.error('Error fetching and filtering donations:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getPrograms = (req, res) => {
	res.render('programs');
};

const getAddNewProgram = (req, res) => {
	res.render('program');
};
const getEditProgram = async (req, res) => {
	const { id } = req.params;

	try {
		const program = await Program.findById(id);

		if (!program) {
			return res.status(404).json({ error: 'Program not found' });
		}

		res.render('program', {
			program,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getProfile = async (req, res) => {
	res.render('profile');
};

const getTeamMembers = async (req, res) => {
	const teamMembers = await TeamMember.find();
	res.render('teamMembers', { teamMembers });
};

const getEditMember = async (req, res) => {
	try {
		// Retrieve the member ID from the URL parameters
		const id = req.params.id;

		// Check if the ID is valid
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid member ID' });
		}

		// Fetch the member from the database
		const member = await TeamMember.findById(id);

		// If the member doesn't exist, return a 404 error
		if (!member) {
			return res.status(404).redirect('/404');
		}

		// Render the edit form, passing the member data to the view
		res.status(200).render('editMember', { member });
	} catch (error) {
		console.error('Error fetching member:', error);
		res.status(500).redirect('/500');
	}
};

module.exports = {
	// Home Controller Functions
	getdashboard,
	getPupils,
	getvolunteers,
	getDonations,
	getPrograms,
	getProfile,
	getPupilRecord,
	getVolunteerRecord,
	getAllPrograms,
	getEditProgram,
	getAddNewProgram,
	getProgramById,
	getDonations,
	getTeamMembers,
	getEditMember,
};
