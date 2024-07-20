import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User.Model";

// Interfaces for nested schemas
interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies?: IComment[];
}

interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies?: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: { public_id: string; url: string };
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    question: IComment[];
}

interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: { public_id: string; url: string };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    rating?: number;
    purchased?: number;
}

// Define nested schemas
const CommentSchema = new Schema<IComment>({
    user: { type: Object, required: true },
    question: { type: String, required: true },
    questionReplies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});


const ReviewSchema = new Schema<IReview>({
    user: { type: Object, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
    commentReplies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const LinkSchema = new Schema<ILink>({
    title: { type: String, required: true },
    url: { type: String, required: true }
});

const CourseDataSchema = new Schema<ICourseData>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoThumbnail: { type: Object, required: true },
    videoSection: { type: String, required: true },
    videoLength: { type: Number, required: true },
    videoPlayer: { type: String, required: true },
    links: [LinkSchema],
    suggestion: { type: String },
    question: [CommentSchema]
});

// Main course schema
const CourseSchema = new Schema<ICourse>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedPrice: Number,
    thumbnail: {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    },
    tags: { type: String, required: true },
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benefits: [{ title: { type: String, required: true } }],
    prerequisites: [{ title: { type: String, required: true } }],
    reviews: [ReviewSchema],
    courseData: [CourseDataSchema],
    rating: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 }
}, { timestamps: true });

// Create and export the Course model
const CourseModel: Model<ICourse> = mongoose.model('Course', CourseSchema);
export default CourseModel;
