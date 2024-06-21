import {colors, Exception, ExceptionHandlerError, HttpStatusCodesConstant, LoggerComponent, mySQL} from "../../index";

export function mySqlErrorHandlerUtils(err: mySQL.MysqlError, dbHost?: string | null,
                                       database?: string | null, user?: string | null,
                                       password?: string | null): void {
    switch (err.code) {
        case "EAI_AGAIN":
            LoggerComponent.logErrorMessage(Exception.errorDBHost(dbHost!), Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                `${colors.bgRed(`${colors.white(err.message +`\n${Exception.erNotSupportedAuthMode}`)}`)}`,
                `${colors.red(Exception.mysqlErrorCon)}`,
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        case "ER_NOT_SUPPORTED_AUTH_MODE":
            LoggerComponent.logErrorMessage(Exception.erNotSupportedAuthMode, Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                `${colors.bgRed(`${colors.white(err.message +`\n${Exception.erNotSupportedAuthMode}`)}`)}`,
                `${colors.red(Exception.mysqlErrorCon)}`,
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        case "ER_ACCESS_DENIED_ERROR":
            LoggerComponent.logErrorMessage(Exception.accessDeniedToDBCon(user!, password!), Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                `${colors.bgRed(`${colors.white(err.message +`\n${Exception.accessDeniedToDBCon(user!, password!)}`)}`)}`,
                `${colors.red(Exception.mysqlErrorCon)}`,
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        case "ER_BAD_DB_ERROR":
            LoggerComponent.logErrorMessage(err.message, Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                `${colors.bgRed(`${colors.white(err.message +`\n${Exception.unknownDB(database!)}`)}`)}`,
                `${colors.red(Exception.mysqlErrorCon)}`,
                HttpStatusCodesConstant.NOT_FOUND,
                true
            );
        default:
            LoggerComponent.logErrorMessage(err.message, Exception.mySQLError)
            throw new ExceptionHandlerError(
                `${colors.bgRed(`${colors.white(err.message)}`)}`,
                `${colors.red("MysqlError")}`,
                HttpStatusCodesConstant.GONE,
                true
            );
    }
}