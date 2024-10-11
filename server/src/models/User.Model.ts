import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
import jwt from 'jsonwebtoken'
import { env } from '../utils/EnviromentHandler';

// Define the interface for the User model
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}

// Create a schema for the User model
const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate: {
                validator: function (value: string) {
                    return emailRegexPattern.test(value);
                },
                message: 'Please enter a valid email',
            },
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        avatar: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        role: {
            type: String,
            default: 'user',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        courses: [
            {
                courseId: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.signAccessToken = function () {
    return jwt.sign({ id: this._id }, env.auth.accessToken || '',{
        expiresIn:'5m'
    })
}

userSchema.methods.signRefreshToken = function () {
    return jwt.sign({ id: this._id }, env.auth.refreshToken || '',{
        expiresIn:'3d'
    })
}

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {

    return bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
