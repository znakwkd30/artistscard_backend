import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import { Database } from './database';
import { AppBuilder } from './appBuilder';
import { AuthController } from './controller/authController';
import { errorMiddleware } from './middleware/error.middleware';
import { UserController } from './controller/userController';
import { MusicController } from './controller/musicController';

dotenv.config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === 'prod' ? '.env' : '.env.dev'),
});

const app = express();
const port: number = parseInt(process.env.PORT);
const appBuilder = new AppBuilder(app);

Database.initialize();

appBuilder
    .addMiddleware(express.json())
    .addMiddleware(morgan('dev'))
    .addMiddleware(express.urlencoded({ extended: true }))
    .addMiddleware(express.static('public'))
    .addController(new AuthController())
    .addController(new UserController())
    .addController(new MusicController())
    .addMiddleware(errorMiddleware)
    .build(port, () => console.log('Listening on port', port));
