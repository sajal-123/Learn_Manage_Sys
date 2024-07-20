import { ErroHandler } from "../utils/ErrorHandler"
import { Request, Response, NextFunction } from 'express';

const errorHandleMiddleware =
    (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        err.statusCode = err.statusCode || 500;
        err.message = err.message || 'Internal Server Error';

        // Wrong Db id Error
        if (err.name == 'CastError') {
            const message = `resource Not found Invalid: ${err.path}`
            err = new ErroHandler(message, 400)
        }
        if (err.code == 11000) {
            const message = `Duplicate ${Object.keys(err.keyValues)} entered`
            err = new ErroHandler(message, 400)
        }

        if (err.name == 'jsonWebTokenError') {
            const message = `JWt is invalid Please Try Again`
            err = new ErroHandler(message, 400)
        }

        if (err.name == 'TokenExpireError') {
            const message = `JWt get Expired, Try Again`
            err = new ErroHandler(message, 400)
        }

        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })

    };

export {errorHandleMiddleware};
