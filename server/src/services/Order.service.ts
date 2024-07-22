import { NextFunction, Response } from 'express'
import { CatchAsyncError } from '../middleware/CatchAsyncErrors'
import OrderModel from '../models/Ordel.Model'

export const newOrder = async (data: any, next: NextFunction, res: Response) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
    });
}


export const getAllOrderService = async (res: Response) => {
    const courses = await OrderModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses })
}
