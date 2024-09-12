import {LogMessageUtils} from "../core/utils/logMessage.utils";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {ExceptionHandlerError} from "../index";

export class DbConnexionConfigError {
    static mongoDBAuthenticationFailed(e: any) {
        LogMessageUtils.error(
            "MongoDB connection",
            "authentication failed",
            "failed",
            e.code,
            "bad credentials",
            "Authentication failed, be sure the credentials is correct!",
            status.UNAUTHORIZED
        );
        throw new ExceptionHandlerError(
            "Authentication failed, be sure the credentials is correct!",
            "MongoConnectionError",
            status.UNAUTHORIZED,
            true
        );
    }
    
    static mongoDBInvalidUrl(e: any, dbHost: string, dbPort: string) {
        LogMessageUtils.error(
            "MongoDB connection",
            "unable to parse",
            "url",
            e.code,
            "parse url",
            `Unable to parse ${dbHost}:${dbPort} with URL`,
            status.BAD_REQUEST
        );
        throw new ExceptionHandlerError(
            `Unable to parse ${dbHost}:${dbPort} with URL`,
            "MongoConnectionError",
            status.BAD_REQUEST,
            true
        );
    }
    
    static mongoDBEaiAgain(e: any, dbHost: string) {
        LogMessageUtils.error(
            "MongoDB connection",
            "MongoServer selection error",
            "MongoServer",
            e.code,
            "undefined",
            `MongoServerSelectionError: getaddrinfo EAI_AGAIN (${dbHost} is not allow to database connection)`,
            status.BAD_REQUEST
        );
        throw new ExceptionHandlerError(
            `MongoServerSelectionError: getaddrinfo EAI_AGAIN (${dbHost} is not allow to database connection)`,
            "MongoConnectionError",
            status.BAD_REQUEST,
            true
        );
    }

    static mongoDbGlobalError (e: any) {
        LogMessageUtils.error(
            "MongoDB connection",
            "MongoConnection error",
            "",
            e.code,
            "",
            e.message,
            status.NOT_ACCEPTABLE
        );
        throw new ExceptionHandlerError(
            `${e.message}`,
            "MongoConnectionError",
            status.NOT_ACCEPTABLE,
            true
        );
    }
}