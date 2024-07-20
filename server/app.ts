import cookieParser from "cookie-parser";
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
require('dotenv').config();
const app = express();
import { errorHandleMiddleware } from "./src/middleware/error";
import { userRoute } from "./src/Routes/User.Route";
import { courseRoute } from "./src/Routes/Course.Route";
import { orderRoute } from "./src/Routes/Order.Route";

app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(cors(
    {
        origin: process.env.ORIGIN
    }
))

app.use('/api/v1/users', userRoute);
app.use('/api/v1/courses', courseRoute);
app.use('/api/v1/order', orderRoute);
app.get('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Route Not found") as any;
    error.statusCode = 400;
    next(error)
})


app.use(errorHandleMiddleware)

export { app };