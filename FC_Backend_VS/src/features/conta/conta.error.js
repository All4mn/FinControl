import { AppError } from "../../Errors/AppError.js";

export class NotFound extends AppError {
    constructor(message) {
        super(message)
        this.statusCode = 404
    }
}