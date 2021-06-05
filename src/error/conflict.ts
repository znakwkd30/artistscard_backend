import { HttpError } from './httpError';

export class Conflict extends HttpError {
    public statusCode: number = 409;
}
