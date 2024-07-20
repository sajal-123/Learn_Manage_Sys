import { Request } from "express";
import { IUser } from "../models/User.Model";


declare global {
    namespace Express {
        interface Request {
            user?:IUser
    }
}
}