const mongoose = require('mongoose');


async function connectDb() {
	try {
		const connection = await mongoose.connect(process.env.MONGO_CNN, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log('Connected to MongoDB');
		return connection;
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	}
}

module.exports = { connectDb }