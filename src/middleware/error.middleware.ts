import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../error/httpError';

export const errorMiddleware = (err, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        const httpError: HttpError = <HttpError>err;

        return res.status(httpError.statusCode).json({
            statusCode: httpError.statusCode,
            messsage: httpError.message,
        });
    }

    res.status(500).json({
        statusCode: 500,
        message: err.meesage,
    });
};
