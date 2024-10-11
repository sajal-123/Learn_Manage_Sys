import mongoose from "mongoose";
import { env } from "./EnviromentHandler";

const MongoUrl: string = env.mongoUrl || ''

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MongoUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export { connectDB }
