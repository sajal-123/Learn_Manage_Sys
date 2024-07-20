import { NextFunction, Response } from 'express'
import { CatchAsyncError } from '../middleware/CatchAsyncErrors'
import OrderModel from '../models/Ordel.Model'

export const newOrder = CatchAsyncError(async (data: any, next: NextFunction, res: Response) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
    });
})