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
import Redis from 'ioredis';
require('dotenv').config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("redis connected");
        // Return Redis connection configuration
        return {
            host: process.env.REDIS_URL, // Assumes the URL contains the hostname
            port: 6379, // Only include the port if necessary
            tls: {
                rejectUnauthorized: false,  // Disables SSL certificate verification
            },
        };
    }
    throw new Error("Redis connection failed");
}

// Pass the configuration object returned by redisClient to the Redis constructor
export const redis = new Redis(redisClient());


