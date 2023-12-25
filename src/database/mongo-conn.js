import { connect } from "mongoose";

async function connectDb() {
  try {
    const connection = await connect(process.env.MONGO_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to ${process.env.MONGO_CNN}`);
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectDb;
