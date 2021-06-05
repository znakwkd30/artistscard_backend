import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as express from 'express';
import { Database } from './database';
import { AppBuilder } from './appBuilder';
import { AuthController } from './controller/authController';
import { errorMiddleware } from './middleware/error.middleware';
import { UserController } from './controller/userController';

dotenv.config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev'),
});

const app = express();
const port: number = parseInt(process.env.PORT);
const appBuilder = new AppBuilder(app);

Database.initialize();

appBuilder
    .addMiddleware(express.json())
    .addController(new AuthController())
    .addController(new UserController())
    .addMiddleware(errorMiddleware)
    .build(port, () => console.log('Listening on port', port));
