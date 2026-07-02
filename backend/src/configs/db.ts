import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected successfuly!');
  } catch (error) {
    console.error('Error connecting MongoDB');
    process.exit(1);
  }
}
