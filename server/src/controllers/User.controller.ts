import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.Model';
import { ErrorHandler } from '../utils/ErrorHandler';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { IUser } from '../models/User.Model'
require('dotenv').config();
import ejs from 'ejs'
import path from 'path';
import SendEmail from '../utils/sendMails';
import { CatchAsyncError } from '../middleware/CatchAsyncErrors';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '../utils/jwt';
import { redis } from '../utils/redis';
import { getUser, getAllUserService, UpdateUserRoleService } from '../services/user.service';
import cloudinary from 'cloudinary'


interface IRegistration {
    email: string;
    name: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

interface IActivationToken {
    token: string;
    activation_code: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface ISocialAuthBody {
    name: string,
    email: string,
    avatar: string
}

interface IUpdateUserInfo {
    name?: string,
    email?: string
}

interface IUpdateUserPassword {
    oldPassword: string
    newPassword: string
}

interface IUpdateProfilePicture {
    avatar: string
}


export const registerUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password }: IRegistration = req.body;
    console.log(email, name, password)
    try {
        // Check if user with the same email already exists
        if (!email || !name || !password) {
            return next(new ErrorHandler('provide mandatory credentials', 400));

        }
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler('User with this email already exists', 400));
        }

        // Create user in the database
        const user: IRegistration = new UserModel({
            name,
            email,
            password,
        });

        const ActivationToken = createActivationToken(user);
        const activationCode = ActivationToken.activation_code;

        const data = { user: { name: user.name }, activationCode }
        const html = await ejs.render(path.join(__dirname, '../mails/activation_mail.ejs'), data
        )
        try {
            console.log(email, password, name)
            await SendEmail({
                email: user.email,
                subject: "Activate Your Account",
                template: 'activation_mail.ejs',
                data
            })
            return res.status(201).json({ success: true, message: `please check your eamil->${user.email} to activate your account!!!`, ActivationToken: ActivationToken.token })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


export const createActivationToken = (user: any): IActivationToken => {
    const activation_code = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        { user, activation_code },
        process.env.JWT_SECRET as Secret, // Replace with your actual JWT secret stored in environment variable
        { expiresIn: '5m' }
    );

    return { token, activation_code };
};

// verify User 
export const ActivateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body;

        const newUser: {
            user: IUser, activation_code: string
        } = jwt.verify(activation_token, process.env.JWT_SECRET as string) as { user: IUser, activation_code: string }

        console.log(newUser.activation_code);
        console.log(activation_code);

        if (newUser.activation_code !== activation_code) {
            return next(new ErrorHandler('Activation code does not match', 400));
        }

        const { name, email, password } = newUser.user;

        const existedUser = await UserModel.findOne({ email });

        if (existedUser) {
            return next(new ErrorHandler("User Exist Already in our database", 400));
        }

        const createdUser = await UserModel.create({
            name,
            email,
            password
        })

        return res.status(201).json({
            success: true
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));

    }
})


export const LoginReq = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: LoginRequest = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Provide all credentials", 400));
        }
        const user: IUser | null = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler("Email Not exist in DB", 400));
        }
        console.log("user data")

        const isPasswordMatch: boolean = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Please enter a valid Password", 400));
        }
        console.log(process.env.REDIS_URL)
        sendToken(user, 200, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


export const LogOut = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     res.cookie('access_token', '', { maxAge: 1 })
    //     res.cookie('refresh_token', '', { maxAge: 1 })
    //     if (!req || !req.user) return next(new ErrorHandler("Please Login First", 400));
    //     const userId = req.user?._id || '';
    //     redis.del(JSON.stringify(userId));
    //     res.status(200).json({
    //         success: true,
    //         message: "LogOut successFully"
    //     })

    // } catch (error: any) {
    //     return next(new ErrorHandler(error.message, 400));
    // }
})

// update access token
export const UpdateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const refresh_token = req.cookies.refresh_token as string;
    //     const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;
    //     if (!decoded) {
    //         return next(new ErrorHandler('Could Not refresh Token', 400));
    //     }
    //     const session = await redis.get(JSON.stringify(decoded.id))
    //     if (!session) {
    //         return next(new ErrorHandler('please Login to access This resource', 400));
    //     }
    //     const user = JSON.parse(session);
    //     const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
    //         expiresIn: '5m'
    //     });
    //     const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
    //         expiresIn: '3d'
    //     });

    //     req.user = user;

    //     res.cookie('refresh_token', refreshToken, refreshTokenOptions);
    //     res.cookie('access_token', accessToken, accessTokenOptions);

    //     await redis.set(user._id, JSON.stringify(user), 'EX', 604800); // 7Days
    //     res.status(200).json({
    //         success: true,
    //         accessToken
    //     });

    // } catch (error: any) {
    //     return next(new ErrorHandler(error.message, 400));
    // }
})

// get User Info
export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        getUser(userId as string, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// get social Auth
export const socialAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, avatar } = req.body as ISocialAuthBody;
        const user: IUser | null = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            const newUser = await UserModel.create({ email, avatar, name });
            return sendToken(newUser, 200, res);
        } else {
            return sendToken(user, 200, res);
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update User
export const UpdateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body as IUpdateUserInfo;
        const userId = req.user?._id;
        const user = await UserModel.findById(userId);
        if (user && email) {
            const existEmail = await UserModel.findOne({ email });
            if (existEmail)
                return next(new ErrorHandler('Email Already exist in Db', 400));
            user.email = email;
        }
        if (user && name) {
            user.name = name
        }
        await user?.save();
        await redis.set(JSON.stringify(userId), JSON.stringify(user))

        res.status(200).json({
            success: true,
            user,
        })


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update User PRofilePassword
export const UpdateUserPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdateUserPassword;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler('please enter old and New Password', 400))
        }
        const user = await UserModel.findById(req.user?._id).select('+password');
        if (user?.password === undefined) {
            return next(new ErrorHandler('Invalid User', 400))
        }
        const isPasswordMatch = await user.comparePassword(oldPassword);
        if (isPasswordMatch) {
            return next(new ErrorHandler('Invalid Old Password', 400));
        }
        user.password = newPassword;
        await user.save();
        await redis.set(JSON.stringify(user._id), JSON.stringify(user));
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Update User PRofilePicture
export const UpdateProfilePicture = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body;
        const userId = req?.user?._id;
        const user = await UserModel.findById(userId)

        if (avatar && user) {
            // If we have on e avatar with this user avatar
            if (user?.avatar?.public_id) {
                // then destroy it first
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)
            } else {
                const mycloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: 'avatars',
                    width: 150
                });
                user.avatar = {
                    public_id: mycloud.public_id,
                    url: mycloud.secure_url
                }
            }
        }
        await user?.save();
        await redis.set(JSON.stringify(userId), JSON.stringify(user));

        res.status(200).json({
            success: true,
            user
        })


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


// Only for admin
export const GetAllUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllUserService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Update User Role Only for Admin
export const UpdateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        UpdateUserRoleService(id, role, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// Delete User ---- only for admin

export const DeleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            return next(new ErrorHandler('User Not found', 500));
        }
        await user.deleteOne({ id });
        await redis.del(id);

        res.status(200).json({
            success: true,
            message: "User deleted Successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})