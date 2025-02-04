import { HttpStatusCodesConstant } from "@/domain/constants/httpStatusCodes.constant";


/**
 * Handling and catch a Node.js error.
 */
export default class StackTraceError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCodesConstant | any;
    public readonly isOperational: boolean;

    // Centralized error objet that derives from Node's Error.
    constructor(props: string | undefined, name: string, httpCode: HttpStatusCodesConstant | any, isOperational: boolean) {
        super(props);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}