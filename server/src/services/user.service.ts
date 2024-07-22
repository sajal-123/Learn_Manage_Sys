import { Response } from "express";
import { redis } from "../utils/redis";
import { UserModel } from "../models/User.Model";

export async function getUser(id: string, res: Response) {
    const user = await redis.get(JSON.stringify(id))
    return res.status(200).json({
        success: true,
        user
    })
}
export async function getAllUserService(res: Response) {
    const users = await UserModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        users
    })
}
