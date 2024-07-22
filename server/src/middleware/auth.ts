import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./CatchAsyncErrors";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from "../utils/redis";
require('dotenv').config();


// Authenticated user
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.access_token;
        if (!access_token) {
            return next(new ErrorHandler("Not Authorized Login First", 400));
        }

        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;
        if (!decoded) {
            return next(new ErrorHandler("AccessToken is Not valid", 400));
        }
        const user = await redis.get(JSON.stringify(decoded.id));
        if (!user) {
            return next(new ErrorHandler("Please Login to access this resource", 400));
        }
        // To resolve error i created custom.d.ts
        req.user = JSON.parse(user);

        next(); // Ensure to call next to proceed to the next middleware
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// Valid user role 
export const AuthorizedRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // Check if user's role is in the allowed roles array
      if (!roles.includes(req.user?.role || '')) {
        // If not allowed, return an error response
        return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 400));
      }
      // If allowed, proceed to the next middleware or route handler
      next();
    };
  };