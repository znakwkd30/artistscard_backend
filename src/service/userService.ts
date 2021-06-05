import { plainToClass } from 'class-transformer';
import { Database } from '../database';
import { ChangePasswordDTO } from '../dto/request/changePassword.dto';
import { RegisterDTO } from '../dto/request/register.dto';
import { AuthenticationDTO } from '../dto/response/authentication.dto';
import { UserDTO } from '../dto/response/user.dto';
import { User } from '../entity/User';
import { BadRequest } from '../error/badRequest';
import { Conflict } from '../error/conflict';
import { NotFound } from '../error/notFound';
import { JWT } from '../security/jwt';
import { PasswordHash } from '../security/passwordHash';

export interface UserService {
    register(body: RegisterDTO);
    changePassword(userId: string, body: ChangePasswordDTO);
}

export class UserServiceImpl implements UserService {
    public async register(body: RegisterDTO) {
        if (body.password !== body.repeatPassword) {
            throw new BadRequest('Repeat password does not match the password');
        }

        if (await Database.userRepository.findOne({ userId: body.userId })) {
            throw new Conflict('UserId is already being used');
        }

        const user = new User();
        user.username = body.username;
        user.userId = body.userId;
        user.password = await PasswordHash.hashPassword(body.password);

        await Database.userRepository.save(user);

        const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
        const userDTO: UserDTO = plainToClass(UserDTO, user);

        const jwtToken = await JWT.generateTokenAndRefreshToken(user);
        authenticationDTO.user = userDTO;
        authenticationDTO.token = jwtToken.token;
        authenticationDTO.refreshToken = jwtToken.refreshToken;

        return authenticationDTO;
    }

    public async changePassword(userId: string, body: ChangePasswordDTO) {
        const user = await Database.userRepository.findOne({ userId: userId });

        if (!user) {
            throw new NotFound('UserId does Not Exist');
        }

        if (!(await PasswordHash.isPasswordValid(body.password, user.password))) {
            throw new BadRequest('Password is invalid');
        }

        if (body.newPassword !== body.newPasswordRepeat) {
            throw new BadRequest('Repeat password does not match the password');
        }

        const hashPassword = await PasswordHash.hashPassword(body.newPassword);
        await Database.userRepository.update({ userId: user.userId }, { password: hashPassword });
    }
}
