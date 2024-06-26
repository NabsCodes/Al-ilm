// controllers/mainController.js
const Volunteer = require('../models/volunteer');
const Donor = require('../models/donor');
const Cause = require('../models/cause');
const Blog = require('../models/blog');
const Pupil = require('../models/pupil');
const Donation = require('../models/donation');

const print = console.log;
const addOrUpdateData = async (req, res) => {
	try {
		const { type } = req.body; // Assuming a 'type' field is sent to identify the schema type
		print('Body: ', req.body);
		switch (type) {
			case 'volunteer':
				const volunteerData = req.body;
				const newVolunteer = new Volunteer(volunteerData);
				const savedVolunteer = await newVolunteer.save();
				res.status(201).redirect('/volunteer');
				break;

			case 'donor':
				const donorData = req.body;
				const newDonor = new Donor(donorData);
				const savedDonor = await newDonor.save();
				res.status(201).redirect('/donate');
				break;

			case 'cause':
				const causeData = req.body;
				const newCause = new Cause(causeData);
				const savedCause = await newCause.save();
				res.status(201).redirect('/causes');
				break;

			case 'blog':
				const blogData = req.body;
				const { comments, ...blogWithoutComments } = blogData;
				const newBlog = new Blog(blogWithoutComments);

				// Handle comments separately
				// if (comments && Array.isArray(comments)) {
				//     newBlog.comments = comments.map(comment => ({
				//         user: comment.user,
				//         text: comment.text,
				//         createdAt: comment.createdAt || new Date()
				//     }));
				// }

				const savedBlog = await newBlog.save();
				res.status(201).redirect('/blogs');
				break;

			case 'pupil':
				const pupilData = req.body;
				const newPupil = new Pupil(pupilData);
				const savedPupil = await newPupil.save();
				res.status(201).json(savedPupil);
				break;

			default:
				res.status(400).json({ error: 'Invalid schema type' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Controller function to post a new donation
const postDonation = async (req, res) => {
	try {
		// Extract donation data from the request body
		const { amount, d_email, d_name, d_phone, programId, payment_method } = req.body;

		// Create a new Donation instance
		const newDonation = new Donation({
			amount,
			d_email,
			d_name,
			d_phone,
			programId,
			payment_method,
		});

		// Save the new donation to the database
		const savedDonation = await newDonation.save();

		// Redirect to /donate (replace with your actual redirect path)
		res.redirect('/donate');
	} catch (error) {
		console.error('Error posting donation:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const createVolunteer = async (req, res) => {
	try {
		// Extract data from the request body
		const { f_name, s_name, profession, phone, email, gender, self_statement } = req.body;

		// Create a new volunteer instance
		const newVolunteer = new Volunteer({
			f_name,
			s_name,
			profession,
			phone,
			email,
			gender,
			self_statement,
			isLocked,
		});

		// Save the volunteer to the database
		const savedVolunteer = await newVolunteer.save();

		// Respond with the saved volunteer data
		res.status(201).redirect(`/volunteer`);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const postComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, text } = req.body;

		const updatedMessage = await Blog.findByIdAndUpdate(
			id,
			{
				$push: {
					comments: {
						name,
						email,
						text,
					},
				},
			},
			{ new: true }
		);

		res.status(200).redirect(`/blogs/${id}`);
	} catch (error) {
		console.error('Error posting comment:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = {
	addOrUpdateData,
	postDonation,
	createVolunteer,
	postComment,
};
