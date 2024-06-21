import {Exception, ExceptionHandlerError, HttpStatusCodesConstant, LoggerComponent, mySQL} from "../../index";

export function mySqlErrorHandlerUtils(err: mySQL.MysqlError, dbHost?: string | null, database?: string | null, user?: string | null): void {
    switch (err.code) {
        case "EAI_AGAIN":
            LoggerComponent.logErrorMessage(Exception.errorDBHost(dbHost!), Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                err.message +`\n${Exception.erNotSupportedAuthMode}`,
                Exception.mysqlErrorCon,
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        case "ER_NOT_SUPPORTED_AUTH_MODE":
            LoggerComponent.logErrorMessage(Exception.erNotSupportedAuthMode, Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                err.message +`\n${Exception.erNotSupportedAuthMode}`,
                Exception.mysqlErrorCon,
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        case "ER_ACCESS_DENIED_ERROR":
            LoggerComponent.logErrorMessage(Exception.accessDeniedToDBCon(user!), Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                err.message +`\n${Exception.accessDeniedToDBCon(user!)}`,
                Exception.mysqlErrorCon,
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        case "ER_BAD_DB_ERROR":
            LoggerComponent.logErrorMessage(err.message, Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                err.message +`\n${Exception.unknownDB(database!)}`,
                Exception.mysqlErrorCon,
                HttpStatusCodesConstant.NOT_FOUND,
                true
            );
        default:
            LoggerComponent.logErrorMessage(err.message, Exception.mySQLError)
            throw new ExceptionHandlerError(
                err.message,
                "MysqlError",
                HttpStatusCodesConstant.GONE,
                true
            );
    }
}