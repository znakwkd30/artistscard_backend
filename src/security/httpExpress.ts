import { NextFunction, Request, Response } from 'express';
import { Database } from '../database';
import { Unauthorized } from '../error/unauthorized';
import { User } from '../entity/User';
import { NotFound } from '../error/notFound';
import { JWT } from './jwt';

export class HttpExpress {
    public static retrieveBearerTokenFromRequest(req: Request) {
        let authoriziationHeader = req.headers.authorization;

        if (!authoriziationHeader) {
            throw new Unauthorized('Authrization Header is not set');
        }

        if (authoriziationHeader.startsWith('Bearer ')) {
            authoriziationHeader = authoriziationHeader.substring(
                'Bearer '.length,
                authoriziationHeader.length
            );

            return authoriziationHeader;
        }
    }

    public static async getUserByRequest(req: Request) {
        const userId = this.getUserIdByRequest(req);

        const user = await Database.getRepository(User).findOne(userId);

        if (!user) throw new NotFound(`User with the id ${userId} was not found`);

        return user;
    }

    public static getUserIdByRequest(req: Request) {
        const token = this.retrieveBearerTokenFromRequest(req);

        return this.getUserIdByBearerToken(token);
    }

    public static getUserIdByBearerToken(token: string) {
        return JWT.getJwtPayloadValueByKey(token, 'id');
    }

    public static wrapAsync(fn: (req: Request, res: Response, next?: NextFunction) => any) {
        return function (req: Request, res: Response, next?: NextFunction) {
            fn(req, res, next).catch(next);
        };
    }
}
