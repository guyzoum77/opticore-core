import {LogMessageUtils as log, LogMessageUtils} from "../core/utils/logMessage.utils";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {Exception as msg, ExceptionHandlerError as ErrorHandler, ExceptionHandlerError} from "../index";
import StackTraceError from "../core/handlers/errors/base/stackTraceError";

export class DbConnexionConfigError {
    static mongoDBAuthenticationFailed(e: any): void  {
        const stackTrace: StackTraceError = this.traceError(
            msg.mongoDBConnection,
            msg.mongoDBAuthentication,
            status.UNAUTHORIZED
        );
        log.error(
            msg.mongoDBConnection,
            msg.mongoDBAuthentication,
            msg.mongoDBAuthenticationFailed,
            e.code,
            stackTrace.stack!,
            msg.mongoDBAuthenticationError,
            status.UNAUTHORIZED
        );
    }
    
    static mongoDBInvalidUrl(e: any, dbHost: string, dbPort: string): void {
        const stackTrace: StackTraceError = this.traceError(
            msg.mongoDBConnection,
            msg.mongoDBUnableParsingUrl,
            status.BAD_REQUEST
        );
        log.error(
            msg.mongoDBConnection,
            msg.mongoDBUnableParsingUrl,
            msg.mongoDBConnectionUrl,
            e.code,
            stackTrace.stack!,
            `Unable to parse ${dbHost}:${dbPort} with URL`,
            status.BAD_REQUEST
        );
    }
    
    static mongoDBEaiAgain(e: any, dbHost: string) {
        const stackTrace: StackTraceError = this.traceError(
            msg.mongoDBConnection,
            msg.mongoDBServerSelection,
            status.BAD_REQUEST
        );
        log.error(
            msg.mongoDBConnection,
            msg.mongoDBServerSelection,
            msg.mongoDBServer,
            e.code,
            stackTrace.stack!,
            `MongoServerSelectionError: getaddrinfo EAI_AGAIN (${dbHost} is not allow to database connection)`,
            status.BAD_REQUEST
        );
    }

    static mongoDbGlobalError (e: any): void {
        const stackTrace: StackTraceError = this.traceError(e.message, msg.mongoDBConnection, status.NOT_ACCEPTABLE);
        log.error(
            msg.mongoDBConnection,
            msg.mongoDBConnectionError,
            msg.mongoDBError,
            e.code,
            stackTrace.stack!,
            e.message,
            status.NOT_ACCEPTABLE
        );
    }

    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}