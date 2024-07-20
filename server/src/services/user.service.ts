import { Response } from "express";
import { redis } from "../utils/redis";

export async function getUser(id: string, res: Response) {
    const user = await redis.get(JSON.stringify(id))
    return res.status(200).json({
        success: true,
        user
    })
}