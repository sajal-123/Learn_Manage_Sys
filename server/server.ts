// app.js or main file where the server is initialized
import { env } from './src/utils/EnviromentHandler';
import { v2 as cloudinary } from 'cloudinary';
import { app } from './app';
import { connectDB } from './src/utils/DB';

const port = env.port || 8000;

// Cloudinary configuration
try {
    cloudinary.config({
        cloud_name: env.cloud.name,
        api_key: env.cloud.apiKey,
        api_secret: env.cloud.secretKey,
    });
} catch (error) {
    console.error("Cloudinary configuration failed", error);
    process.exit(1);
}

// Function to initialize Redis and database connection
connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(port, () => {
      console.log(`App is listening at port ${port}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit the process in case of failure
  });
