import { Connection, createConnection, ObjectType, Repository } from 'typeorm';
import { RefreshToken } from './entity/RefreshToken';
import { User } from './entity/User';

export class Database {
    public static connection: Connection;
    public static userRepository: Repository<User>;
    public static refreshTokenRepository: Repository<RefreshToken>;

    public static async initialize() {
        this.connection = await createConnection({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            database: process.env.DATABASE_SCHEMA,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            synchronize: true,
            logging: false,
            entities: [process.env.DATABASE_ENTITY],
            migrations: [process.env.DATABASE_MIGRATE],
            subscribers: [process.env.DATABASE_SUBSCRIBERS],
        });
        this.userRepository = this.connection.getRepository(User);
        this.refreshTokenRepository = this.connection.getRepository(RefreshToken);
    }

    public static getRepository<Entity>(target: ObjectType<Entity>) {
        return this.connection.getRepository(target);
    }
}
