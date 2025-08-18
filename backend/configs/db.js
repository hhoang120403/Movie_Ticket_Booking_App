import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('✅ Database connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Database connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Database disconnected');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
