const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://adamahmad:Malammadorikfada123@cluster0.2svvk.mongodb.net/al-ilm';
// 'mongodb://localhost:27017/al-ilm';

// MongoDB Connection Setup check if in production or development
// const MONGODB_URI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost:27017/al-ilm';
mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('Connected to DB!'))
	.catch((error) => console.log(`Error Connecting to Mongo: ${error.message}`));

// Set up Mongoose connection event handlers
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Database Connected!');
});

const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
	session({
		secret: 'your-secret-key',
		resave: true,
		saveUninitialized: true,
	})
);
app.use(flash());

// Routes
const indexRoute = require('./routes/main');
const authRoute = require('./controllers/auth');
app.use('/', indexRoute);
app.use(authRoute);

// Start the server
const PORT = process.env.PORT || 3000;

app.get('/404', (req, res) => {
	res.render('404');
});
app.get('/500', (req, res) => {
	res.render('500');
});

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		app.listen(PORT);
		console.log(`Server is running on http://localhost:${PORT}`);
	})
	.catch((err) => {
		console.error('Error connecting to the database:', err);
		// Handle the error and perform any necessary actions
		// For example, you can gracefully terminate the application or show an error page
		// res.render('500')
	});
