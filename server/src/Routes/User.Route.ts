import { Router } from 'express';
import { registerUser, ActivateUser, LoginReq, LogOut, UpdateAccessToken, getUserInfo, socialAuth, UpdateUser, UpdateUserPassword, UpdateProfilePicture, GetAllUsers } from '../controllers/User.controller';
import { AuthorizedRole, isAuthenticated } from '../middleware/auth';

const userRoute = Router();

// Route to handle user registration
userRoute.post('/registration', registerUser);
userRoute.post('/activate-user', ActivateUser);
userRoute.post('/login', LoginReq);
userRoute.get('/logout',isAuthenticated, LogOut);
userRoute.get('/refreshToken',UpdateAccessToken);
userRoute.get('/me',isAuthenticated,getUserInfo);
userRoute.get('/social-auth',socialAuth);
userRoute.put('/update-user-info',isAuthenticated,UpdateUser);
userRoute.put('/update-user-password',isAuthenticated,UpdateUserPassword);
userRoute.put('/update-user-avatar',isAuthenticated,UpdateProfilePicture);
userRoute.get('/get-orders', isAuthenticated, AuthorizedRole(['admin']), GetAllUsers);

export { userRoute };
