const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Spin up an in-memory mongo server only if we're not in production and using the local fallback
    if (process.env.NODE_ENV !== 'production' && (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('memory'))) {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-Memory MongoDB Started for Dev`);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
