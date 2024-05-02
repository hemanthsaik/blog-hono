import * as mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(String(process.env.MONGO_URI), {
    autoIndex: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
