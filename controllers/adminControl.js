const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');
const Volunteer = require('../models/volunteer'); // Adjust the path based on your project structure
const User = require('../models/user'); // Adjust the path based on your project structure
const ProgramModel = require('../models/program'); // Adjust the path based on your project structure
const Blog = require('../models/blog'); // Adjust the path based on your project structure
const Message = require('../models/msg');
const Pupil = require('../models/pupil'); // Make sure to adjust the path based on your file structure
const TeamMember = require('../models/teamMembers');

// Controller function to create a new pupil
const createPupil = async (req, res) => {
	try {
		const newPupilData = req.body;
		const newPupil = new Pupil(newPupilData);
		const savedPupil = await newPupil.save();

		// Respond with the created pupil data
		res.status(201).redirect(`/admin/pupil/record/${savedPupil._id}`);
	} catch (error) {
		console.error('Error creating pupil:', error);
		res.status(500).redirect('/500');
	}
};

// Controller function to update an existing pupil
const updatePupil = async (req, res) => {
	const { id } = req.params;
	const updateData = req.body;
	console.log('The new data: ', req.body);
	try {
		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid Pupil ID' });
		}

		// Find the pupil by ID and update the data
		const updatedPupil = await Pupil.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

		// If pupil not found, return 404 Not Found
		if (!updatedPupil) {
			return res.status(404).redirect('/404');
		}

		// Respond with the updated pupil data
		res.status(200).redirect(`/admin/pupil/record/${id}`);
	} catch (error) {
		console.error('Error updating pupil:', error);
		res.status(500).redirect('/500');
	}
};

const addContactToPupil = async (req, res) => {
	const { id } = req.params;
	const newContactData = req.body;

	try {
		// Call the function to add the new contact to the pupil
		const updatedPupil = await Pupil.addContactToPupil(id, newContactData);

		// Respond with the updated pupil, including the new contact
		res.status(200).redirect(`/admin/pupil/record/${id}`);
	} catch (error) {
		// Handle errors and respond with an error message
		console.error('Error adding contact to pupil:', error);
		res.status(500).redirect('/500');
	}
};

// Controller function to handle the POST request for creating a new volunteer
const createVolunteer = async (req, res) => {
	try {
		// Extract data from the request body
		const { f_name, s_name, profession, phone, email, gender } = req.body;

		// Create a new volunteer instance
		const newVolunteer = new Volunteer({
			f_name,
			s_name,
			profession,
			phone,
			email,
			gender,
		});

		// Save the volunteer to the database
		const savedVolunteer = await newVolunteer.save();

		// Respond with the saved volunteer data
		res.status(201).redirect(`/admin/volunteers/${savedVolunteer._id}`);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

// Controller function to update the Volunteer model
const updateVolunteer = async (req, res) => {
	const { id } = req.params;
	let updateData = req.body;
	if (req.body) {
		updateData.address = {
			number: req.body.number || '',
			street: req.body.street || '',
			city: req.body.city || '',
			zip: req.body.zip || '',
			country: req.body.country || '',
		};
	}
	console.log('The Body: ', updateData);

	try {
		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid Volunteer ID' });
		}

		// Find the volunteer by ID and update the data
		const updatedVolunteer = await Volunteer.findByIdAndUpdate(id, updateData, { new: true });

		console.log('This is updated: ', updatedVolunteer);
		// If volunteer not found, return 404 Not Found
		if (!updatedVolunteer) {
			return res.status(404).redirect('/404');
		}

		// Respond with the updated volunteer data
		res.status(200).redirect(`/admin/volunteers/${id}`);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

const addContact = async (req, res) => {
	const { id } = req.params;
	const { c_name, c_relation, c_contact, c_type } = req.body;

	try {
		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid Volunteer ID' });
		}

		// Find the volunteer by ID
		const volunteer = await Volunteer.findById(id);

		// If volunteer not found, return 404 Not Found
		if (!volunteer) {
			return res.status(404).json({ error: 'Volunteer not found' });
		}

		// Add the new contact to the volunteer's contacts array
		volunteer.contacts.push({
			c_name,
			c_relation,
			c_contact,
			c_type,
		});

		// Save the updated volunteer with the new contact
		const updatedVolunteer = await volunteer.save();
		console.log('updatedVolunteer: ', updatedVolunteer);
		// Respond with the updated volunteer data
		res.status(200).redirect(`/admin/volunteers/${id}`);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

// Controller function to update isLocked field for a user by userId
const updateUserIsLocked = async (req, res) => {
	const { id } = req.params;

	try {
		// Find the user by userId in the database
		const user = await User.findOne({ _id: id });

		// If user not found, return 404 Not Found
		if (!user) {
			return res.status(404).redirect('/404');
		}

		console.log('This is the user: ', user);
		// Toggle the value of isLocked
		user.isLocked = !user.isLocked;

		// Save the updated user to the database
		await user.save();

		// Respond with the updated user data
		res.status(201).redirect(`/admin/volunteers/${user.recordId}`);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

const activateUser = async (req, res) => {
	const { id } = req.params;

	try {
		// Find the volunteer by userId in the database
		const volunteer = await Volunteer.findById(id);

		// If volunteer not found, return 404 Not Found
		if (!volunteer) {
			return res.status(404).redirect('/404');
		}

		// Check if a user with the same email already exists
		const existingUser = await User.findOne({ email: volunteer.email });

		// If user with the same email exists, return an error
		if (existingUser) {
			return res.status(400).json({ error: 'User with this email already exists' });
		}

		// Generate a default password for the new user
		let password = `${volunteer.s_name}@123`;

		// Generate a salt and hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a new user instance
		const newUser = new User({
			name: volunteer.f_name + ' ' + volunteer.s_name,
			phone: volunteer.phone,
			email: volunteer.email,
			recordId: id,
			role: 'Volunteer',
			password: hashedPassword,
		});

		// Save the new user to the database
		await newUser.save();

		// Respond with the updated user data
		res.status(201).redirect(`/admin/volunteers/${id}`);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

// Program Functions  ******************************************
const { fetchAllPrograms, fetchProgramById, updateProgram, createProgram } = require('../models/program'); // Import the database functions
const { getVolunteerPage } = require('./main');

// Controller function to fetch all programs
const getAllPrograms = async (req, res) => {
	try {
		const programs = await fetchAllPrograms();
		res.json(programs);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

// Controller function to fetch a single program by ID
const getProgramById = async (req, res) => {
	const { id } = req.params;

	try {
		const program = await fetchProgramById(id);

		if (!program) {
			return res.status(404).redirect('/404');
		}

		res.render('program');
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

// Controller function to update a program by ID
const updateProgramById = async (req, res) => {
	const { id } = req.params;
	const updatedProgramData = req.body;
	console.log('Thabody Of Edit Program: ', req.body);
	try {
		const updatedProgram = await updateProgram(id, updatedProgramData);

		if (!updatedProgram) {
			return res.status(404).redirect('/404');
		}

		res.redirect(`/admin/programs/edit-prg/${id}`);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

const toggleProgramStatus = async (programId) => {
	try {
		// Find the program by ID
		const program = await Program.findById(programId);

		// If program not found, return null
		if (!program) {
			return null;
		}

		// Toggle the status
		program.status = program.status === 'on' ? 'off' : 'on';

		// Save the updated program
		const updatedProgram = await program.save();

		return updatedProgram;
	} catch (error) {
		throw error;
	}
};

// Your route or controller function
const updateStatus = async (req, res) => {
	const { id } = req.params;
	console.log('Updating status: ', programId);
	try {
		// Call the toggleProgramStatus function
		const updatedProgram = await toggleProgramStatus(programId);

		// If the program is not found, return 404 Not Found
		if (!updatedProgram) {
			return res.status(404).redirect('/404');
		}

		// Respond with the updated program data
		res.status(200).json(updatedProgram);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

// Controller function to create a new program
const createNewProgram = async (req, res) => {
	const newProgramData = req.body;
	console.log('This are your inputs: ', newProgramData);
	try {
		const createdProgram = await createProgram(newProgramData);
		res.status(201).redirect(`/admin/programs/edit-prg/${createdProgram._id}`);
	} catch (error) {
		console.error(error);
		res.status(500).redirect('/500');
	}
};

const toggleBlogActivation = async (req, res) => {
	try {
		const blogId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(blogId)) {
			return res.status(400).json({ error: 'Invalid Blog ID' });
		}

		// Fetch the blog by ID from the database
		const blog = await Blog.findById(blogId);

		// Check if the blog is not found
		if (!blog) {
			return res.status(404).redirect('/404');
		}

		// Toggle the isActive property
		blog.isActive = !blog.isActive;

		// Save the updated blog to the database
		const updatedBlog = await blog.save();
		console.log('The article Active mode is Toggled', blog.isActive);
		res.status(200).redirect(`/admin/blogs/edit-blog/${updatedBlog._id}`);
	} catch (error) {
		console.error('Error toggling blog activation:', error);
		res.status(500).redirect('/500');
	}
};

const toggleBlogFeature = async (req, res) => {
	try {
		const blogId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(blogId)) {
			return res.status(400).json({ error: 'Invalid Blog ID' });
		}

		// Fetch the blog by ID from the database
		const blog = await Blog.findById(blogId);

		// Check if the blog is not found
		if (!blog) {
			return res.status(404).redirect('/404');
		}

		// Toggle the isActive property
		blog.isFeature = !blog.isFeature;

		// Save the updated blog to the database
		const updatedBlog = await blog.save();
		console.log('The article Active mode is Toggled', blog.isFeature);
		res.status(200).redirect(`/admin/blogs/edit-blog/${updatedBlog._id}`);
	} catch (error) {
		console.error('Error toggling blog activation:', error);
		res.status(500).redirect('/500');
	}
};

const toggleBlogComment = async (req, res) => {
	try {
		const blogId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(blogId)) {
			return res.status(400).json({ error: 'Invalid Blog ID' });
		}

		// Fetch the blog by ID from the database
		const blog = await Blog.findById(blogId);

		// Check if the blog is not found
		if (!blog) {
			return res.status(404).redirect('/404');
		}

		// Toggle the isActive property
		blog.allowComment = !blog.allowComment;

		// Save the updated blog to the database
		const updatedBlog = await blog.save();
		console.log('The article Active mode is Toggled', blog.allowComment);
		res.status(200).redirect(`/admin/blogs/edit-blog/${updatedBlog._id}`);
	} catch (error) {
		console.error('Error toggling blog activation:', error);
		res.status(500).redirect('/500');
	}
};

const getPostBlog = (req, res) => {
	// Fetch and pass individual blog data to the view
	res.render('add-blog');
};

const postBlog = async (req, res) => {
	try {
		const { title, blogPost, e_readTime, author } = req.body;
		const photo = req.body.file;
		// Create a new blog post
		const newBlog = new Blog({
			title,
			photo,
			blogPost,
			e_readTime,
			author: author || 'Admin',
		});

		// Save the new blog post to the database
		const savedBlog = await newBlog.save();

		res.status(201).redirect(`/admin/blogs/edit-blog/${savedBlog._id}`);
	} catch (error) {
		console.error('Error posting blog:', error);
		res.status(500).redirect('/500');
	}
};

const updateBlog = async (req, res) => {
	try {
		const blogId = req.params.id;
		const { title, photo, description, e_readTime, author } = req.body;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(blogId)) {
			return res.status(400).json({ error: 'Invalid Blog ID' });
		}

		// Fetch the blog by ID from the database
		const blog = await Blog.findById(blogId);

		// Check if the blog is not found
		if (!blog) {
			return res.status(404).redirect('/404');
		}

		// Update the blog properties
		blog.title = title;
		blog.photo = photo;
		blog.description = description;
		blog.e_readTime = e_readTime;
		blog.author = author;

		// Save the updated blog to the database
		const updatedBlog = await blog.save();
		console.log('updating Blog: ', updatedBlog);

		res.status(200).redirect(`/admin/blogs/blog/${blogId}`);
	} catch (error) {
		console.error('Error updating blog:', error);
		res.status(500).redirect('/500');
	}
};

const getSingleBlog = async (req, res) => {
	try {
		const blogId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(blogId)) {
			return res.status(400).json({ error: 'Invalid Blog ID' });
		}

		// Fetch the active blog by ID from the database
		const blog = await Blog.findOne({ _id: blogId });

		// Check if the blog is not found
		if (!blog) {
			return res.status(404).redirect('/404');
		}

		// Format the blog date
		const formattedBlogDate = blog.date.toLocaleDateString('en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});

		// Format the comments
		const formattedComments = blog.comments.map((comment) => {
			const formattedCommentDate = comment.date.toLocaleDateString('en-US', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});

			return {
				...comment.toObject(),
				formattedCommentDate,
			};
		});

		console.log('Getting single Blog: ', formattedComments);

		res.status(200).render('edit-blog', {
			blog: { ...blog.toObject(), formattedDate: formattedBlogDate },
			comments: formattedComments || [],
		});
	} catch (error) {
		console.error('Error fetching active blog:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const deleteBlog = async (req, res) => {
	try {
		const blogId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(blogId)) {
			return res.status(400).json({ error: 'Invalid Blog ID' });
		}

		// Delete the blog by ID from the database
		const deletedBlog = await Blog.findByIdAndDelete(blogId);

		// Check if the blog is not found
		if (!deletedBlog) {
			return res.status(404).json({ error: 'Blog not found' });
		}

		res.status(200).redirect(`/admin/blogs/all`);
	} catch (error) {
		console.error('Error deleting blog:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getBlogs = async (req, res) => {
	try {
		// Fetch all active blogs from the database and sort them by date in descending order
		const blogs = await Blog.find().sort({ date: -1 });

		// Format comment dates for each blog
		const formattedBlogs = blogs.map((blog) => {
			// Format the blog date
			const formattedBlogDate = blog.date.toLocaleDateString('en-US', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});

			// Format comment dates
			const formattedComments = blog.comments.map((comment) => ({
				...comment.toObject(),
				formattedCommentDate: comment.date.toLocaleDateString('en-US', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				}),
			}));

			return {
				...blog.toObject(),
				formattedBlogDate,
				comments: formattedComments,
			};
		});

		console.log('These are your blog: ', formattedBlogs);

		res.status(200).render('admin-blogs', {
			blogs: formattedBlogs,
		});
	} catch (error) {
		console.error('Error fetching all blogs:', error);
		res.status(500).redirect('/500');
	}
};

const getAllMessages = async (req, res) => {
	try {
		const messages = await Message.find().sort({ date: -1 });

		// Format the date for each message
		const formattedMessages = messages.map((message) => {
			const formattedDate = message.date
				? message.date.toLocaleDateString('en-US', {
						day: '2-digit',
						month: 'short',
						year: 'numeric',
				  })
				: 'Not Available';

			return {
				...message.toObject(),
				formattedDate,
			};
		});

		console.log('Messages: ', formattedMessages);

		res.status(200).render('msgs', {
			msgs: formattedMessages,
		});
	} catch (error) {
		console.error('Error fetching messages:', error);
		res.status(500).redirect('/500');
	}
};

const getSingleMessage = async (req, res) => {
	try {
		const messageId = req.params.id;

		// Ensure that the ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(messageId)) {
			return res.status(400).json({ error: 'Invalid Message ID' });
		}

		const message = await Message.findById(messageId);

		// Check if the message is not found
		if (!message) {
			res.status(404).redirect('/404');
		}

		res.status(200).json(message);
	} catch (error) {
		console.error('Error fetching single message:', error);
		res.status(500).redirect('/500');
	}
};

const getSettings = async (req, res) => {
	try {
		const messages = await Message.find().sort({ createdAt: -1 });
		console.log('Messages: ', messages);
		res.status(200).render('settings', {
			msgs: messages,
		});
	} catch (error) {
		console.error('Error fetching messages:', error);
		res.status(500).redirect('/500');
	}
};

const postMember = async (req, res) => {
	try {
		console.log(req.file);
		const memberData = {
			name: req.body.name,
			role: req.body.role,
			bio: req.body.bio,
			img: '/uploads/' + req.file.filename,
		};
		const member = new TeamMember(memberData);
		await member.save();
		res.status(201).redirect('/admin/team-members');
	} catch (err) {
		console.error('Error posting member:', err);
		res.status(500).redirect('/500');
	}
};

const updateMember = async (req, res) => {
	try {
		const { id } = req.params;

		// If there's a file in the request (presumably an image), add its path to the update object
		if (req.file) {
			req.body.img = '/uploads/' + req.file.filename;
		} else {
			// If there's no file in the request, keep the existing image
			const member = await TeamMember.findById(id);
			req.body.img = member.img;
		}

		// Update the team member in the database with the new data
		await TeamMember.findByIdAndUpdate(id, { ...req.body });
		res.status(200).redirect('/admin/team-members');
	} catch (error) {
		console.error('Error updating member:', error);
		res.status(500).redirect('/500');
	}
};

const deleteMember = async (req, res) => {
	try {
		const { id } = req.params;

		const member = await TeamMember.findById(id);
		if (!member) {
			return res.status(404).json({ error: 'Member not found' });
		}

		// Delete the uploaded file associated with the member
		if (member.img) {
			const filePath = path.join(__dirname, '..', member.img);
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error('Error deleting file:', err);
				}
			});
		}

		const deletedMember = await TeamMember.findByIdAndDelete(id);
		if (!deletedMember) {
			return res.status(404).redirect('/404');
		}

		res.status(200).redirect('/admin/team-members');
	} catch (error) {
		console.error('Error deleting member:', error);
		res.status(500).redirect('/500');
	}
};

// Export the controller function
module.exports = {
	createVolunteer,
	updateUserIsLocked,
	activateUser,
	getAllPrograms,
	getProgramById,
	updateProgramById,
	createNewProgram,
	updateVolunteer,
	addContact,
	updateStatus,
	createPupil,
	updatePupil,
	addContactToPupil,
	toggleBlogActivation,
	getPostBlog,
	postBlog,
	updateBlog,
	getSingleBlog,
	deleteBlog,
	getBlogs,
	toggleBlogFeature,
	getAllMessages,
	getSingleMessage,
	toggleBlogComment,
	getSettings,
	postMember,
	updateMember,
	deleteMember,
};
