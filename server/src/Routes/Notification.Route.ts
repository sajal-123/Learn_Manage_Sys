import { Router } from 'express';
import { AuthorizedRole, isAuthenticated } from '../middleware/auth';
import { getNotifications, updateNotifications } from '../controllers/Notification.controller';
const notificationRoute = Router();

// Route to handle user registration
notificationRoute.get('/get-all-notification', isAuthenticated, AuthorizedRole(['admin']), getNotifications);
notificationRoute.post('/update-notification/:id', isAuthenticated, AuthorizedRole(['admin']), updateNotifications);


export { notificationRoute };
