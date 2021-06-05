import { Request, Response } from 'express';
import { ChangePasswordDTO } from '../dto/request/changePassword.dto';
import { RegisterDTO } from '../dto/request/register.dto';
import { HttpExpress } from '../security/httpExpress';
import { UserService, UserServiceImpl } from '../service/userService';
import { BaseController } from './baseController';

export class UserController extends BaseController {
    private readonly userService: UserService;

    constructor() {
        super();
        this.userService = new UserServiceImpl();
    }

    public initializeEndpoints() {
        this.addAsyncEndpoint('POST', '/register', this.register);
    }

    public register = async (req: Request, res: Response) => {
        const body: RegisterDTO = req.body;

        const authenticationDTO = await this.userService.register(body);

        res.json(authenticationDTO);
    };

    public changePassword = async (req: Request, res: Response) => {
        const user = await HttpExpress.getUserByRequest(req);
        const body: ChangePasswordDTO = req.body;

        await this.userService.changePassword(user.userId, body);

        res.status(204).send();
    };
}
