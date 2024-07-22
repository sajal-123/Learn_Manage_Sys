import NotificationModel from "../models/Notification.Model";
import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import cron from 'node-cron'
// get all the NOtifications ----- only for admin
export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const Notifications = await NotificationModel.find().sort({ createdAt: -1 })
        return res.status(201).json({
            success: true,
            Notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

// Update Notification
export const updateNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Notification = await NotificationModel.findById(req.params.id);
        if (!Notification) {
            return next(new ErrorHandler('Notification Not found', 404))
        }
        Notification.status ? Notification.status == 'read' : Notification.status;
        await Notification.save();
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });
        return res.status(201).json({
            success: true,
            notifications
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


cron.schedule("0 0 0 * * *", async () => {
    console.log("--------");
    console.log("Running cron");
    const thirdyDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({ status: "read", createAt: { $lt: thirdyDayAgo } })
    console.log("Deleted Read Notification")
})
// Delete Notification

