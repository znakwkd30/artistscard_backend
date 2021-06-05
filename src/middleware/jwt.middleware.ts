import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from '../error/unauthorized';
import { HttpExpress } from '../security/httpExpress';
import { JWT } from '../security/jwt';

export default function (req: Request, res: Response, next: NextFunction) {
    const token = HttpExpress.retrieveBearerTokenFromRequest(req);

    if (!JWT.isTokenValid(token)) {
        throw new Unauthorized('JWT is not valid');
    }

    next();
}
