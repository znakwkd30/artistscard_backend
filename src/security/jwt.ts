import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as moment from 'moment';
import { User } from '../entity/User';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../entity/RefreshToken';
import { Database } from '../database';

dotenv.config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev'),
});

export class JWT {
    private static JWT_SECRET = process.env.JWT_SECRET;

    public static async generateTokenAndRefreshToken(user: User) {
        const payload = {
            id: user.id,
            uid: user.userId,
        };

        const jwtId = uuidv4();
        const token = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: '1d',
            jwtid: jwtId,
            subject: user.id.toString(),
        });

        const refreshToken = await this.generateRefreshTokenForUserAndToken(user, jwtId);

        return {
            token,
            refreshToken,
        };
    }

    public static async generateRefreshTokenForUserAndToken(user: User, jwtId: string) {
        const refreshToken = new RefreshToken();
        refreshToken.user = user;
        refreshToken.jwtId = jwtId;
        refreshToken.expiryDate = moment().add(10, 'd').toDate();

        await Database.refreshTokenRepository.save(refreshToken);

        return refreshToken.id;
    }

    public static isTokenValid(token: string, ignoreExpiration: boolean = false) {
        try {
            jwt.verify(token, this.JWT_SECRET, {
                ignoreExpiration: ignoreExpiration,
            });

            return true;
        } catch (error) {
            return false;
        }
    }

    public static getJwtId(token: string) {
        const decodedToken = jwt.decode(token);
        return decodedToken['jti'];
    }

    public static async isRefreshTokenLinkedToToken(refreshToken: RefreshToken, jwtId: string) {
        if (!refreshToken) return false;

        if (refreshToken.jwtId !== jwtId) return false;

        return true;
    }

    public static async isRefreshTokenExpired(refreshToken: RefreshToken) {
        if (moment().isAfter(refreshToken.expiryDate)) return true;

        return false;
    }

    public static async isRefreshTokenUsedOrInvalidated(refreshToken: RefreshToken) {
        return refreshToken.used || refreshToken.invalidated;
    }

    public static getJwtPayloadValueByKey(token: string, key: string) {
        const decodedToken = jwt.decode(token);
        return decodedToken[key];
    }

    public static async getRefreshTokenByJwtToken(token: string) {
        const jti = this.getJwtId(token);

        const refreshToken = await Database.refreshTokenRepository.findOne({
            jwtId: jti,
        });

        if (!refreshToken) {
            throw new Error('Refresh token does not exist');
        }

        return refreshToken;
    }

    public static async invalidateRefreshToken(refreshToken: RefreshToken) {
        refreshToken.invalidated = true;

        await Database.refreshTokenRepository.save(refreshToken);
    }
}
