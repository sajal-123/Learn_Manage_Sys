require('dotenv').config();

const env = {
  port: process.env.PORT || 8000,
  origin: process.env.ORIGIN!.split(','), // Handling the array
  mongoUrl: process.env.MONGO_URL,
  nodeEnv: process.env.NODE_ENV,
  
  cloud: {
    name: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUD_API_KEY,
    secretKey: process.env.CLOUD_SECRET_KEY,
    cloudinaryUrl: process.env.CLOUDINARY_URL,
  },
  
  auth: {
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE,
    refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE,
    jwtSecret: process.env.JWT_SECRET,
  },
  
  redis: {
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  },
  
  smtp: {
    host: process.env.SMTPHOST,
    email: process.env.SMTP_EMAIL,
    service: process.env.SMTPSERVICE,
    password: process.env.SMTP_PASSWORD,
    port: process.env.SMTPPORT,
  },
};

export {env}
