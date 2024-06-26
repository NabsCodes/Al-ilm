const { fetchAllPrograms, fetchProgramById, updateProgram, createProgram, Program } = require('../models/program'); // Import the database functions
// const Program = require('../models/program'); // Import the database functions
const mongoose = require('mongoose');
const Blog = require('../models/blog'); // Import the database functions
const Message = require('../models/msg'); // Import the database functions
const TeamMember = require('../models/teamMembers');

// controllers/homeController.js
const getHomePage = (req, res) => {
	res.render('home');
};

const getAboutPage = async (req, res) => {
	try {
		const teamMembers = await TeamMember.find();
		res.render('about', { teamMembers });
	} catch (err) {
		console.error('Error fetching team members:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getContactPage = (req, res) => {
	res.render('contact');
};

const getDonatePage = (req, res) => {
	res.render('donate');
};

// controllers/blogController.js
const getBlogsPage = async (req, res) => {
	try {
		// Fetch all active blogs from the database
		const activeBlogs = await Blog.find({ isActive: true });
		const featureBlogs = await Blog.find({ isFeature: true })
			.sort({ _id: -1 }) // Sort by ObjectId in descending order (assuming ObjectId is auto-generated)
			.limit(3);

		console.log('These are your blog: ', activeBlogs);
		res.status(200).render('blogs', {
			activeBlogs,
			featureBlogs,
		});
	} catch (error) {
		console.error('Error fetching all active blogs:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getSingleBlogPage = async (req, res) => {
	try {
		const blogId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(blogId)) {
			return res.status(400).json({ error: 'Invalid Blog ID' });
		}

		// Fetch the active blog by ID from the database
		const blog = await Blog.findOne({ _id: blogId, isActive: true });

		// Check if the blog is not found
		if (!blog) {
			return res.status(404).json({ error: 'Active Blog not found' });
		}

		// Increment views count and save
		const updatedBlogView = await Blog.findByIdAndUpdate(
			blogId,
			{
				$inc: { views: 1 },
			},
			{ new: true }
		);
		updatedBlogView.save();

		// Assuming there is a 'date' field in your schema
		const formattedDate = blog.date.toLocaleDateString('en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
		console.log('Blog: ', blog);
		res.status(200).render('blog-view', {
			blog: { ...blog.toObject(), formattedDate },
			comments: blog.comments,
		});
	} catch (error) {
		console.error('Error fetching active blog:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// controllers/volunteerController.js
const getVolunteerPage = (req, res) => {
	// Fetch and pass volunteer data to the view
	res.render('volunteer');
};

const formatPrograms = (programs) => {
	try {
		const currentDate = new Date();

		const formattedPrograms = programs
			.filter((program) => {
				// Assuming your program model has a field named targetDate representing the target date
				const targetDate = new Date(program.targetDate);
				return targetDate >= currentDate; // Only include programs with a target date greater than or equal to the current date
			})
			.map((program) => {
				// Check if amount and raised properties exist
				const amount = program.amount
					? program.amount.toLocaleString('en-US', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 2,
					  })
					: 'Not Available';

				const raised = program.raised
					? program.raised.toLocaleString('en-US', {
							style: 'currency',
							currency: 'NGN',
							minimumFractionDigits: 2,
					  })
					: 'Not Available';
				console.log('PASSED CURRENCIES');
				// Format target date to "dd/mm/yyyy"
				const formattedTargetDate = program.targetDate
					? program.targetDate.toLocaleDateString('en-US', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
					  })
					: 'Not Available';
				// Add formatted amount, raised, and target date to the program object
				return {
					...program.toObject(),
					amount,
					raised,
					formattedTargetDate,
				};
			});
		console.log('Formatted here: ', formattedPrograms);
		return formattedPrograms;
	} catch (error) {
		throw error;
	}
};

const getCausesPage = async (req, res) => {
	try {
		// Fetch all programs from the database
		const programs = await Program.find();
		console.log('The failing: ', programs);

		// Format the programs
		const formattedPrograms = formatPrograms(programs);
		console.log('The Programs: ', formattedPrograms);

		// Respond with the formatted programs
		res.status(200).render('causes', {
			programs: formattedPrograms,
		});
	} catch (error) {
		console.error('Error fetching programs:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// const  = (req, res) => {
//     // Fetch and pass individual cause data to the view
//     res.render('cause-view');
//};

const getSingleCausePage = async (req, res) => {
	try {
		const programId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(programId)) {
			return res.status(400).json({ error: 'Invalid Program ID' });
		}

		// Fetch the program by ID from the database
		const program = await Program.findById(programId).populate('participants').populate('supervisors').populate('donors');

		// Check if the program is not found
		if (!program) {
			return res.status(404).json({ error: 'Program not found' });
		}

		// Format target date to "dd/mm/yyyy"
		const formattedTargetDate = program.targetDate
			? new Date(program.targetDate).toLocaleDateString('en-US', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
			  })
			: 'Not Available';

		// Format amount and raised properties
		const currencyAmount = program.goal
			? program.goal.toLocaleString('en-US', {
					style: 'currency',
					currency: 'NGN',
					minimumFractionDigits: 2,
			  })
			: 'Not Available';

		const currencyRaised =
			program.donors
				.reduce((total, donor) => total + (donor.amount || 0), 0)
				.toLocaleString('en-US', {
					style: 'currency',
					currency: 'NGN',
					minimumFractionDigits: 2,
				}) || 'Not Available';
		// Respond with the fetched and formatted program entry
		res.status(200).render('cause-view', {
			program: {
				...program.toObject(),
				formattedTargetDate,
				currencyAmount,
				currencyRaised,
			},
		});
	} catch (error) {
		console.error('Error fetching and formatting program view:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const postMessage = async (req, res) => {
	try {
		const { s_name, s_email, s_message, s_phone } = req.body;

		const newMessage = new Message({
			s_name,
			s_email,
			s_message,
			s_phone,
		});

		const savedMessage = await newMessage.save();
		console.log('Your Post: ', savedMessage);
		res.status(201).redirect('/contact');
	} catch (error) {
		console.error('Error posting message:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const likeOrDislikeComment = async (req, res) => {
	try {
		const { blogId, commentId, action } = req.params;
		// action should be 'like' or 'dislike'

		const updateField = {};
		updateField[action === 'like' ? 'likes' : 'dislikes'] = 1;

		const updatedBlog = await Blog.findOneAndUpdate({ _id: blogId, 'comments._id': commentId }, { $inc: updateField }, { new: true });

		if (!updatedBlog) {
			return res.status(404).json({ error: 'Blog or comment not found' });
		}

		res.status(200).redirect(`/blogs/${blogId}`);
	} catch (error) {
		console.error('Error liking or disliking comment:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const addDislike = async (req, res) => {
	try {
		const { id } = req.params;

		const updatedMessage = await Message.findByIdAndUpdate(
			id,
			{
				$inc: { dislikes: 1 },
			},
			{ new: true }
		);

		res.status(200).redirect(`/blogs/${id}`);
	} catch (error) {
		console.error('Error adding dislike:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const addLike = async (req, res) => {
	try {
		const { id } = req.params;

		const updatedMessage = await Message.findByIdAndUpdate(
			id,
			{
				$inc: { likes: 1 },
			},
			{ new: true }
		);

		res.status(200).redirect(`/blogs/${id}`);
	} catch (error) {
		console.error('Error adding like:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const postComment = async (req, res) => {
	try {
		const { id } = req.params;
		const { user, name, email, text } = req.body;

		const updatedMessage = await Message.findByIdAndUpdate(
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
	// Home Controller Functions
	getHomePage,
	getAboutPage,
	getContactPage,
	getDonatePage,

	// Blog Controller Functions
	getBlogsPage,
	getSingleBlogPage,

	// Volunteer Controller Functions
	getVolunteerPage,

	// Cause Controller Functions
	getCausesPage,
	getSingleCausePage,
	postMessage,
	likeOrDislikeComment,
	addDislike,
	addLike,
	postComment,
};
