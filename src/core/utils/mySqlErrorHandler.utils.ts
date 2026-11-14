import {Exception as msg, HttpStatusCodesConstant as status, LogMessageUtils} from "../../index";
import type {QueryError} from "mysql2";
import {LoggerCore} from "opticore-logger";

export function mySqlErrorHandlerUtils(err: QueryError, dbHost?: string | null,
                                       database?: string | null, user?: string | null,
                                       password?: string | null): void {
    const logger: LoggerCore = new LoggerCore();
    
    switch (err.code) {
        case "EAI_AGAIN":
            logger.error({ message: msg.errorDBHost(dbHost!) });
            LogMessageUtils.error(
                msg.mySQLError,
                msg.EAI_AGAIN,
                err.stack,
                msg.errorDBHost(dbHost!),
                status.NOT_ACCEPTABLE
            );
            break;
        case "ER_NOT_SUPPORTED_AUTH_MODE":
            logger.error({ message: msg.erNotSupportedAuthModeError });
            LogMessageUtils.error(
                msg.dbConnection,
                msg.ER_NOT_SUPPORTED_AUTH_MODE,
                err.stack!,
                msg.erNotSupportedAuthModeError,
                status.NOT_ACCEPTABLE
            );
            break;
        case "ER_ACCESS_DENIED_ERROR":
            logger.error({ message: msg.accessDeniedToDBCon(user!, password!) });
            LogMessageUtils.error(
                msg.dbConnection,
                msg.ER_ACCESS_DENIED_ERROR,
                err.stack!,
                msg.accessDeniedToDBCon(user!, password!),
                status.NOT_ACCEPTABLE
            );
            break;
        case "ER_BAD_DB_ERROR":
            logger.error({ message: msg.unknownDB(database!) });
            LogMessageUtils.error(
                msg.dbConnection,
                msg.ER_BAD_DB_ERROR,
                err.stack!,
                msg.unknownDB(database!),
                status.NOT_ACCEPTABLE
            );
            break;
        default:
            logger.error({ message: err.message });
            LogMessageUtils.error(
                msg.dbConnection,
                msg.mysqlErrorCon,
                err.stack!,
                err.message,
                status.NOT_ACCEPTABLE
            );
    }
}
