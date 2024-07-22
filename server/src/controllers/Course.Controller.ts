import cloudinary from 'cloudinary';
import { ErrorHandler } from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/CatchAsyncErrors';
import { Request, Response, NextFunction } from 'express';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';
import ejs from 'ejs'
import path from 'path';
import mongoose from 'mongoose';
import SendEmail from '../utils/sendMails';
import NotificationModel from '../models/Notification.Model';
import { getAllCourseService } from '../services/course.service';
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "Courses"
            })
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        await createCourse(data, res)

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const EditCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "Courses"
            })
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        const courseId = req.params.id;
        const course = await CourseModel.findByIdAndUpdate(courseId, {
            $set: data,
        },
            { new: true }
        )
        res.status(201).json(
            { success: true, course }
        )
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const iscatchExist = await redis.get(JSON.stringify(courseId));
        if (iscatchExist) {
            res.status(200).json(
                { success: true, iscatchExist }
            )
        }
        const course = await CourseModel.findById(courseId).select('-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links');

        await redis.set(JSON.stringify(courseId), JSON.stringify(course))

        res.status(201).json(
            { success: true, course }
        )
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const getAllCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const iscatchExist = await redis.get('allCourses');
        if (iscatchExist) {
            res.status(200).json(
                { success: true, iscatchExist }
            )
        }
        const courses = await CourseModel.find().select('-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links');
        await redis.set('allCourses', JSON.stringify(courses))
        res.status(201).json(
            { success: true, courses }
        )
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Get course-content only for valid user

export const getCourseByuser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = userCourseList?.find((course: any) => {
            courseId.toString() === courseId
        })
        if (!courseExist) {
            return next(new ErrorHandler("YOu are not eligible for this course", 404));
        }
        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;
        return res.status(200).json({
            success: true,
            content,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


interface IAddQuestionData {
    question: string,
    courseId: string,
    contentId: string
}

export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: IAddQuestionData = req.body;
        const course = await CourseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }
        //  const courseContent=course?.courseData?.find((item:any)=>item.id===courseId);
        const courseContent = course?.courseData?.find((item: any) => item._id.equals(courseId));
        if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }
        // create a new Question object 
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        }
        // Adding this question to our course content
        courseContent.question.push(newQuestion);

        await NotificationModel.create({
            user: req.user?._id,
            title: "New Question Recieved",
            message: `You have a new Question from  ${courseContent?.title}`
        })

        await course?.save();
        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


interface IAddAnswerData {
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string
}


export const AddAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;
        const course = await CourseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }
        //  const courseContent=course?.courseData?.find((item:any)=>item.id===courseId);
        const courseContent = course?.courseData?.find((item: any) => item._id.equals(courseId));
        if (!courseContent) {
            return next(new ErrorHandler("Invalid Content Id", 400));
        }
        const question = courseContent?.question.find((item: any) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler("Invalid Question Id", 400));
        }
        // create a new answer object 
        const newAnswer: any = {
            user: redis.sunionBuffer,
            answer,
        }
        question.questionReplies?.push(newAnswer)
        await course?.save();
        if (req.user?._id === question.user._id) {
            //   create a notification
            await NotificationModel.create({
                user: req.user?._id,
                title: "New Answer reply Recieved",
                message: `You have a new Question from  ${courseContent?.title}`
            })

        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title
            }
            const html = await ejs.renderFile(path.join(__dirname, "../mails/question_reply.ejs"), data)
            try {
                await SendEmail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question_reply.ejs",
                    data
                })
                res.status(200).json({
                    success: true,
                    course
                })
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            }
        }


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Add review in courses
interface IAddReviewData {
    userId: string,
    review: string,
    courseId: string,
    rating: number,
}


export const AddReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usercourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = usercourseList?.find((course: any) => course._id.toString() === courseId.toString());
        if (!courseExist) {
            return next(new ErrorHandler("You are not eligible to access this course", 400));
        }
        const course = await CourseModel.findById(courseId);
        const { review, rating }: IAddReviewData = req.body;

        const reviewData: any = {
            user: req.user,
            comment: review,
            rating
        }

        course?.reviews.push(reviewData);
        let avg = 0;
        course?.reviews.forEach((rev: any) => {
            avg += rev.rating
        })

        if (course)
            course.rating = avg / course?.reviews.length;


        await course?.save();

        const notification = {
            title: "New Review Recieved",
            message: `${req.user?.name} has a give an review in ${course?.name}`
        }

        // Create notification



        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


// Add replies in Reviews
interface IAddReviewData {
    comment: string,
    courseId: string,
    reviewId: string
}

export const AddReplyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { comment, courseId, reviewId }: IAddReviewData = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("course nOt found", 404))
        }
        const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler("Review nOt found", 404))
        }
        const commentReply: any = {
            user: req.user,
            comment
        }
        review.commentReplies?.push(commentReply)
        await course?.save();
        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


// Only for admin
export const GetAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCourseService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})