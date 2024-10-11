import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./CatchAsyncErrors";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from "../utils/redis";
import { env } from "../utils/EnviromentHandler";

export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.access_token;
        if (!access_token) {
            return next(new ErrorHandler("Not Authorized Login First", 400));
        }

        const decoded = jwt.verify(access_token, env.auth.accessToken as string) as JwtPayload;
        if (!decoded) {
            return next(new ErrorHandler("AccessToken is Not valid", 400));
        }
        const user = await redis.get(JSON.stringify(decoded.id));
        
        if (!user) {
            return next(new ErrorHandler("Please Login to access this resource", 400));
        }

        req.user = JSON.parse(user);

        next(); 
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


export const AuthorizedRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!roles.includes(req.user?.role || '')) {

            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 400));
      }

      next();
    };
  };