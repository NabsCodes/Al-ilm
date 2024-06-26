const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mainController = require('../controllers/main');
const mainPostController = require('../controllers/main-posts');
const adminController = require('../controllers/admin');
const superControl = require('../controllers/adminControl');

router.get('/', mainController.getHomePage);
router.get('/home', mainController.getHomePage);
router.get('/about', mainController.getAboutPage);
router.get('/contact', mainController.getContactPage);
router.post('/contact', mainController.postMessage);
router.get('/donate', mainController.getDonatePage);
router.post('/donate', mainPostController.postDonation);
router.get('/blogs', mainController.getBlogsPage);
router.get('/blogs/:id', mainController.getSingleBlogPage);
router.post('/blogs/like/:id', mainController.addLike);
router.post('/blogs/dislike/:id', mainController.addDislike);
router.post('/blogs/:id/comment/:cid', mainController.addDislike);
router.post('/blogs/:id/likes', mainController.likeOrDislikeComment);

router.post('/blogs/comment/:id', mainPostController.postComment);
// router.get('/create-blog', mainController.getCreateBlogPage);
router.get('/volunteer', mainController.getVolunteerPage);
router.post('/volunteer/application/submit', mainPostController.createVolunteer);

router.get('/causes', mainController.getCausesPage);
router.get('/causes/:id', mainController.getSingleCausePage);
// router.get('/add-blog', mainController.getAddBlogPage);
// router.get('/add-cause', mainController.getAddCausePage);

// Route to handle adding or updating data
router.post('/addOrUpdateData', mainPostController.addOrUpdateData);
router.get('/admin/pupils/list', adminController.getPupils);
router.get('/admin/dashboard', adminController.getdashboard);
router.get('/admin/volunteers/list', adminController.getvolunteers);

router.get('/admin/donations', adminController.getDonations);
router.get('/admin/profile/:id', adminController.getProfile);
router.get('/admin/pupil/record/:id', adminController.getPupilRecord);
router.post('/admin/pupil/record/add', superControl.createPupil);
router.post('/admin/pupil/contact/add/:id', superControl.addContactToPupil);
router.post('/admin/pupil/update/record/:id', superControl.updatePupil);

// Admin Posts volunteers
router.post('/admin/register/volunteer', superControl.createVolunteer);
router.post('/admin/volunteer/edit-prf/:id', superControl.updateVolunteer);
router.get('/admin/control/create/user-account/:id', superControl.activateUser);
router.get('/admin/control/lock-account/:id', superControl.updateUserIsLocked);
router.get('/admin/volunteers/:id', adminController.getVolunteerRecord);
router.post('/admin/volunteers/add-contact/:id', superControl.addContact);

// Admin post program
// Route to get all programs
// router.get('/admin/all/programs', superControl.getAllPrograms);
// // Route to get a program by ID
// router.get('/admin/all/program-detail/:id', superControl.getProgramById);
// // Route to update a program by ID
// router.post('/admin/program-detail/update/:id', superControl.updateProgramById);
// Route to create a new program
router.post('/admin/programs/create-prg', superControl.createNewProgram);
router.get('/admin/programs/create-prg', adminController.getAddNewProgram);
router.get('/admin/programs/edit-prg/:id', adminController.getProgramById);
router.post('/admin/programs/edit-prg/:id', superControl.updateProgramById);
router.post('/admin/programs/update-status/:id', superControl.updateStatus);
// router.post('/admin/programs/update-status/:id', superControl.updateStatus);
router.get('/admin/programs', adminController.getAllPrograms);
// router.get('/causes/:id', adminController.getSingleCausePage);

// BLOGS
router.get('/admin/blogs/all', superControl.getBlogs);
router.get('/admin/blogs/blog/:id', superControl.getSingleBlog);
router.get('/admin/blogs/add-blog', superControl.getPostBlog);
router.get('/admin/blogs/edit-blog/:id', superControl.getSingleBlog);
router.get('/admin/blogs/activation-mode/:id', superControl.toggleBlogActivation);
router.get('/admin/blogs/feature-mode/:id', superControl.toggleBlogFeature);
router.get('/admin/blogs/comment-mode/:id', superControl.toggleBlogComment);
router.post('/admin/blogs/add-blog', superControl.postBlog);
router.post('/admin/blogs/update-blog/:id', superControl.updateBlog);
router.post('/admin/blogs/delete-blog', superControl.deleteBlog);

// Team Members
router.get('/admin/team-members', adminController.getTeamMembers);
router.post('/admin/team-members/add-member', upload.single('img'), superControl.postMember);
router.get('/admin/team-members/edit-member/:id', adminController.getEditMember);
router.post('/admin/team-members/edit-member/:id', upload.single('img'), superControl.updateMember);
router.post('/admin/team-members/delete-member/:id', superControl.deleteMember);

//messages
router.get('/admin/messages/all/', superControl.getAllMessages);
router.get('/admin/messages/msg/:id', superControl.getSingleMessage);
router.get('/admin/settings', superControl.getSettings);

// let upload = ''upload.single('doc'),
// Route to handle document upload for a program by ID
router.post('/admin/program/:id/upload-doc', async (req, res) => {
	const { id } = req.params;
	const { originalname, path } = req.file;

	try {
		// Fetch the program by ID
		const program = await programController.fetchProgramById(id);

		if (!program) {
			return res.status(404).json({ error: 'Program not found' });
		}

		// Update the program's 'docs' field with the uploaded document details
		const updatedProgram = await programController.updateProgram(id, {
			$push: {
				docs: {
					name: originalname,
					dateUploaded: new Date(),
					path: path,
				},
			},
		});

		res.json(updatedProgram);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
