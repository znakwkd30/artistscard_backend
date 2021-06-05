import { Request, Response } from 'express';
import { RegisterDTO } from '../dto/request/register.dto';
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
}
