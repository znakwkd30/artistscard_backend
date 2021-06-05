import { plainToClass } from 'class-transformer';
import { Database } from '../database';
import { LoginDTO } from '../dto/request/login.dto';
import { RefreshTokenDTO } from '../dto/request/refreshToken.dto';
import { AuthenticationDTO } from '../dto/response/authentication.dto';
import { UserDTO } from '../dto/response/user.dto';
import { Unauthorized } from '../error/unauthorized';
import { NotFound } from '../error/notFound';
import { BadRequest } from '../error/badRequest';
import { JWT } from '../security/jwt';
import { PasswordHash } from '../security/passwordHash';

export interface AuthService {
    login(body: LoginDTO);
    logout(token: string);
    refreshToken(body: RefreshTokenDTO);
}

export class AuthServiceImpl implements AuthService {
    public async login(body: LoginDTO) {
        const user = await Database.userRepository.findOne({ userId: body.userId });

        if (!user) {
            throw new NotFound('UserId does not exist');
        }

        if (!(await PasswordHash.isPasswordValid(body.passowrd, user.password))) {
            throw new BadRequest('Password is invalid');
        }

        const { token, refreshToken } = await JWT.generateTokenAndRefreshToken(user);

        const authenticationDTO = new AuthenticationDTO();
        authenticationDTO.user = plainToClass(UserDTO, user);
        authenticationDTO.token = token;
        authenticationDTO.refreshToken = refreshToken;

        return authenticationDTO;
    }

    public async logout(token: string) {
        if (!JWT.isTokenValid(token, true)) {
            throw new Unauthorized('Unauthorized');
        }

        const refreshToken = await JWT.getRefreshTokenByJwtToken(token);

        await JWT.invalidateRefreshToken(refreshToken);
    }

    public async refreshToken(body: RefreshTokenDTO) {
        if (!JWT.isTokenValid(body.token, true)) {
            throw new Unauthorized('JWT is not valid');
        }

        const jwtId = JWT.getJwtId(body.token);

        const user = await Database.userRepository.findOne(
            JWT.getJwtPayloadValueByKey(body.token, 'id')
        );

        if (!user) {
            throw new NotFound('User does not exist');
        }

        const refreshToken = await Database.refreshTokenRepository.findOne(body.refreshToken);

        if (!(await JWT.isRefreshTokenLinkedToToken(refreshToken, jwtId))) {
            throw new Unauthorized('Token does not match with Refresh Token');
        }

        if (await JWT.isRefreshTokenExpired(refreshToken)) {
            throw new Unauthorized('Refresh Token has expired');
        }

        if (await JWT.isRefreshTokenUsedOrInvalidated(refreshToken)) {
            throw new Unauthorized('Refresh Token has been used or invalidated');
        }

        refreshToken.used = true;

        await Database.refreshTokenRepository.save(refreshToken);

        const tokenResults = await JWT.generateTokenAndRefreshToken(user);

        const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
        authenticationDTO.user = plainToClass(UserDTO, user);
        authenticationDTO.token = tokenResults.token;
        authenticationDTO.refreshToken = tokenResults.refreshToken;

        return authenticationDTO;
    }
}
