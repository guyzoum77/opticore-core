import {Exception, ExceptionHandlerError, HttpStatusCodesConstant, LoggerComponent, mySQL } from "../..";
import {exceptions} from "winston";

/**
 *
 * @param dbConnection
 * @param user
 * @param database
 * @constructor
 *
 * Return void
 */
export default function CheckerMySqlDatabaseConnectionService(dbConnection: any, user: string, database: string): void {
    dbConnection.connect((err: mySQL.MysqlError): void => {
        if (err) {
            LoggerComponent.logErrorMessage(err.message, Exception.mysqlErrorCon);
            throw new ExceptionHandlerError(
                err.message,
                Exception.mysqlErrorCon,
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        }

        const data = {
            successMessage: Exception.dbConnexionSuccess,
            status: HttpStatusCodesConstant.OK
        };
        LoggerComponent.logSuccessMessage(JSON.stringify(data), Exception.mysqlErrorCon);
        dbConnection.end((endConErr: mySQL.MysqlError): void => {
            if (endConErr) {
                switch (endConErr.code) {
                    case "ER_NOT_SUPPORTED_AUTH_MODE":
                        LoggerComponent.logErrorMessage(Exception.erNotSupportedAuthMode, Exception.mysqlErrorCon);
                        throw new ExceptionHandlerError(
                            endConErr.message +`\n${Exception.erNotSupportedAuthMode}`,
                            Exception.mysqlErrorCon,
                            HttpStatusCodesConstant.UNAUTHORIZED,
                            true
                        );
                    case "ER_ACCESS_DENIED_ERROR":
                        LoggerComponent.logErrorMessage(Exception.accessDeniedToDBCon(user), Exception.mysqlErrorCon);
                        throw new ExceptionHandlerError(
                            endConErr.message +`\n${Exception.accessDeniedToDBCon(user)}`,
                            Exception.mysqlErrorCon,
                            HttpStatusCodesConstant.UNAUTHORIZED,
                            true
                        );
                    case "ER_BAD_DB_ERROR":
                        LoggerComponent.logErrorMessage(endConErr.message, Exception.mysqlErrorCon);
                        throw new ExceptionHandlerError(
                            endConErr.message +`\n${Exception.unknownDB(database)}`,
                            Exception.mysqlErrorCon,
                            HttpStatusCodesConstant.NOT_FOUND,
                            true
                        );
                    default:
                        LoggerComponent.logErrorMessage(endConErr.message, Exception.mySQLError)
                        throw new ExceptionHandlerError(
                            endConErr.message,
                            "MysqlError",
                            HttpStatusCodesConstant.GONE,
                            true
                        );
                }
            }
            const data = {
                successMessage: Exception.dbConnexionClosed,
                status: HttpStatusCodesConstant.SERVICE_UNAVAILABLE
            }
            LoggerComponent.logSuccessMessage(data, Exception.mySqlCloseConnection);
        });
    });
}