// src/server.ts
require('dotenv').config();
import {v2 as cloudinary} from 'cloudinary'
import {app} from './app'
import { connectDB } from './src/utils/DB';
const port = process.env.PORT || 3000;


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_SECRET_KEY,
})

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});