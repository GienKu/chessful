import mongoose from 'mongoose';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '..', '.env');
  dotenv.config({ path: pathToEnv });
}

// Connect to MongoDB (adjust URI as needed)
const MONGODB_URI = process.env.MONGODB_URI;

const connectWithRetry = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to ' + MONGODB_URI);
  } catch (error) {
    console.error('Failed to connect to MongoDB, retrying in 5 seconds...', error);
    setTimeout(connectWithRetry, 5000);
  }
};
 

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Attempting to reconnect...');
  connectWithRetry();
});

connectWithRetry();

export default mongoose;
