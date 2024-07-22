import express from "express";
import { AuthorizedRole, isAuthenticated } from "../middleware/auth";
import { getCoursesAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/Analytics.Controller";
const analyticRouter = express.Router();

analyticRouter.get('/get-users-analytics', isAuthenticated, AuthorizedRole(['admin']), getUsersAnalytics);
analyticRouter.get('/get-orders-analytics', isAuthenticated, AuthorizedRole(['admin']), getOrdersAnalytics);
analyticRouter.get('/get-courses-analytics', isAuthenticated, AuthorizedRole(['admin']), getCoursesAnalytics);

export { analyticRouter };