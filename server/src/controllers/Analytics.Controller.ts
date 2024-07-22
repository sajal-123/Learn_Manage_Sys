import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import { UserModel } from "../models/User.Model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/Ordel.Model";

// Get user analytics -> only for admin
export const getUsersAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(UserModel);
        return res.status(201).json({
            users,
            success: true
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
// Get courses analytics -> only for admin

export const getCoursesAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthsData(CourseModel);
        return res.status(201).json({
            courses,
            success: true
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
// Get order analytics -> only for admin

export const getOrdersAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel);
        return res.status(201).json({
            orders,
            success: true
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
