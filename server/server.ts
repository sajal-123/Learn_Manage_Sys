import { env } from './src/utils/EnviromentHandler';
import { v2 as cloudinary } from 'cloudinary';
import { app } from './app';
import { connectDB } from './src/utils/DB';
import { redis } from './src/utils/redis'; // Import your Redis client

const port = env.port || 8000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: env.cloud.name,
  api_key: env.cloud.apiKey,
  api_secret: env.cloud.secretKey,
});

// Function to initialize Redis and database connection
const startServer = async () => {
  try {
    // Initialize DB connection
    await connectDB();
    console.log('Connected to the database');

    // Initialize Redis
    await redis.ping();  // Ping to ensure Redis is connected
    console.log('Redis is connected');

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error while starting the server:', err);
    process.exit(1);
  }
};

// Call the function to start the server
startServer();
