import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";


export const createCourse = async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(200).json({ success: true, course })
}


export const getAllCourseService = async (res: Response) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses })
}
