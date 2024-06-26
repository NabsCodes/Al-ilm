const isAdminMiddleware = (req, res, next) => {
	// Assuming you have stored user role in the request object after authentication
	const userRole = req.user.role;

	// Check if the user is an admin
	if (userRole === 'admin') {
		// If admin, proceed to the next middleware or route handler
		next();
	} else {
		// If not an admin, redirect to the home page
		res.redirect('/');
	}
};
