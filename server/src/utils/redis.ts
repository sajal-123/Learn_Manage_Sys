// import Redis from 'ioredis';
// require('dotenv').config();
// const redisClient = ()=>{
//     if(process.env.REDIS_URL){
//         console.log("redis connected");
//         return process.env.REDIS_URL 
//     }
//     throw new Error("Redis connection failed")
// }

// export const redis = new Redis(redisClient());
// --------------------------------------------------------------------------------------
// import Redis from 'ioredis';
// require('dotenv').config();

// const redisClient = () => {
//     if (process.env.REDIS_URL) {
//         console.log("redis connected");
//         // Return Redis connection configuration
//         return {
//             host: process.env.REDIS_URL, // Assumes the URL contains the hostname
//             port: 6379, // Only include the port if necessary
//             tls: {
//                 rejectUnauthorized: false,  // Disables SSL certificate verification
//             },
//         };
//     }
//     throw new Error("Redis connection failed");
// }

// // Pass the configuration object returned by redisClient to the Redis constructor
// export const redis = new Redis(redisClient());



// -----------------------------------------------------------------------------

import Redis from 'ioredis';
import { env } from './EnviromentHandler';
const redisClient = () => {
  if (env.redis.url) {
    console.log('Redis configuration set.');
    return env.redis.url;
  }
  throw new Error('Redis connection failed: REDIS_URL is not defined.');
};

// Create a Redis client instance
export const redis = new Redis(redisClient());

// Optional event listeners
redis.on('connect', () => {
  console.log('Redis connected successfully.');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('reconnecting', () => {
  console.log('Redis reconnecting...'); // Add this line
});

