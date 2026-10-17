import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/premium_ecommerce';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`\x1b[32m✔ MongoDB muvaffaqiyatli ulandi: ${conn.connection.host} / ${conn.connection.name}\x1b[0m`);
  } catch (error) {
    isConnected = false;
    console.warn(`\x1b[33m⚠ MongoDB ulanmadi (${error.message})\x1b[0m`);
    console.warn(`\x1b[36m💡 Maslahat: backend/.env faylida MONGO_URI ni o'z MongoDB Atlas connection stringingizga o'zgartiring!\x1b[0m`);
    console.warn(`   Masalan: MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/premium_ecommerce\x1b[0m`);
  }
};

export const isDbConnected = () => isConnected;
export default connectDB;
