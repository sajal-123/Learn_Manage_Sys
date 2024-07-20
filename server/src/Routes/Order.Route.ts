import { Router } from 'express';
import { AuthorizedRole, isAuthenticated } from '../middleware/auth';
import { CreateOrder } from '../controllers/Order.Controller';
const orderRoute = Router();

// Route to handle user registration
orderRoute.post('/create-order', isAuthenticated, AuthorizedRole(['admin', 'user']), CreateOrder);


export { orderRoute };
