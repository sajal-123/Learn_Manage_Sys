import { LayoutModel } from "../models/Layout.Model";
import { CatchAsyncError } from "../middleware/CatchAsyncErrors";
import { ErrorHandler } from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import cloudinary from 'cloudinary'


// Create Layout ---- only for admin
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        const typeExist = await LayoutModel.findOne({ type });
        if (typeExist) {
            return next(new ErrorHandler(`${type}  already exist`, 400))
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;

            const Mycloud = await cloudinary.v2.uploader.upload(image, {
                folder: 'Layout'
            })
            const banner = {
                image: {
                    public_id: Mycloud.public_id,
                    url: Mycloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.create(banner);
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItem = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.create({ type: "FAQ", faq: faqItem })
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const CategoriesItem = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    }
                })
            )
            await LayoutModel.create({ type: "Categories", categories: CategoriesItem })
        }
        res.status(201).json({
            message: "Layout Created Successfully",
            success: true
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Edit Layout ---- only for admin
export const EditLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            await cloudinary.v2.uploader.destroy(bannerData?.Image.public_id);
            const Mycloud = await cloudinary.v2.uploader.upload(image, {
                folder: 'Layout'
            })
            const banner = {
                image: {
                    public_id: Mycloud.public_id,
                    url: Mycloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner });

        }
        if (type === "FAQ") {
            const FaqItem = await LayoutModel.findOne({ type: "FAQ" });

            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(FaqItem?._id, { type: "FAQ", faq: faqItems })
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoryItem = await LayoutModel.findOne({ type: "Categories" });
            const CategoriesItem = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(categoryItem?._id, { type: "Categories", categories: CategoriesItem })
        }
        res.status(201).json({
            message: "Layout Updated Successfully",
            success: true
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})


// Get Layout By type 
export const getLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        const layout = await LayoutModel.findOne({ type });
        res.status(201).json({
            layout,
            success: true
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
