import { NextFunction, Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import { ErrorHandler } from "../utils/ErrorHandler";

export const createCourse = CatchAsyncError(async (data:any,res: Response) => {
    const course = await CourseModel.create(data);
    res.status(200).json({ success: true, course })
})
