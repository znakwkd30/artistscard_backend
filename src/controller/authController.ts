import { Request, Response } from 'express';
import { LoginDTO } from '../dto/request/login.dto';
import { RefreshTokenDTO } from '../dto/request/refreshToken.dto';
import { HttpExpress } from '../security/httpExpress';
import { AuthService, AuthServiceImpl } from '../service/authService';
import { BaseController } from './baseController';

export class AuthController extends BaseController {
    private readonly authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthServiceImpl();
    }

    public initializeEndpoints() {
        this.addAsyncEndpoint('POST', '/login', this.login);
        this.addAsyncEndpoint('POST', '/logout', this.logout);
        this.addAsyncEndpoint('POST', '/refresh/token', this.refreshToken);
    }

    public login = async (req: Request, res: Response) => {
        const body: LoginDTO = req.body;

        const authenticationDTO = await this.authService.login(body);

        res.json(authenticationDTO);
    };

    public logout = async (req: Request, res: Response) => {
        const token = HttpExpress.retrieveBearerTokenFromRequest(req);

        await this.authService.logout(token);

        res.json({ message: 'Logout successfully' });
    };

    public refreshToken = async (req: Request, res: Response) => {
        const body: RefreshTokenDTO = req.body;

        const authenticationDTO = await this.authService.refreshToken(body);

        res.json(authenticationDTO);
    };
}
