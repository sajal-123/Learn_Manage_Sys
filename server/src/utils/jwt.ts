import { IUser } from "../models/User.Model";
import { Response } from "express";
import { redis } from './redis';
import { env } from "./EnviromentHandler";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}


export const accessTokenExpire = parseInt(env.auth.accessTokenExpire || '300', 10);
export const refreshTokenExpire = parseInt(env.auth.refreshTokenExpire || '1200', 10);

export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production'
};

export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production'
};


export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
    try {
        const accessToken = user.signAccessToken();
        const refreshToken = user.signRefreshToken();

        await redis.set(JSON.stringify(user._id), JSON.stringify(user));

        res.cookie('refresh_token', refreshToken, refreshTokenOptions);
        res.cookie('access_token', accessToken, accessTokenOptions);

        res.status(statusCode).json({
            success: true,
            user,
            accessToken
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
