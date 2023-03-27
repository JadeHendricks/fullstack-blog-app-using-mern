const mongoose = require('mongoose');

const connectDB = async () => {

	const dbConnectionString = process.env.MONOGODB_URL
	.replace("<USERNAME>", process.env.MONGODB_USERNAME)
	.replace("<PASSWORD>", process.env.MONGODB_PASSWORD);

	try {
		await mongoose.connect(dbConnectionString, {
			useNewUrlParser: true,
      		useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;