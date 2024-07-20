import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.Model';
import { ErrorHandler } from '../utils/ErrorHandler';
import dotenv from 'dotenv';
dotenv.config();
import ejs from 'ejs';
import path from 'path';
import SendEmail from '../utils/sendMails';
import { CatchAsyncError } from '../middleware/CatchAsyncErrors';
import CourseModel from '../models/course.model';
import { newOrder } from '../services/Order.service';
import NotificationModel from '../models/Notification.Model';

export const CreateOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as { courseId: string; payment_info: object };

        const user = await UserModel.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const courseExistInUser = user.courses.find((course: any) => course._id.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const data: any = {
            courseId: course._id,
            userId: user._id,
            payment_info
        };

        const mailData = {
            order: {
                _id: course._id?.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            },
            user: {
                name: user.name,
                email: user.email
            }
        };

        const emailTemplatePath = path.join(__dirname, '../mails/Order_confirmation.ejs');
        const html = await ejs.renderFile(emailTemplatePath, { order: mailData });

        try {
            if (user) {
                await SendEmail({
                    email: user.email,
                    subject: 'Order Confirmation',
                    template: "Order_Confirmation.ejs",
                    data: mailData
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }

        user?.courses.push(course._id);
        await user?.save();

        await NotificationModel.create({
            user: user._id,
            title: "New Order",
            message: `You have a new Order from  ${course.name}`
        })

        course.purchased ? course.purchased += 1 : course.purchased;
        
        await course?.save();
        newOrder(data, res, next);


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
