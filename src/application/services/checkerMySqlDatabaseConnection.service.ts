import {Exception, ExceptionHandlerError, HttpStatusCodesConstant, LoggerComponent, mySQL } from "../..";

/**
 *
 * @param dbConnection
 * @constructor
 *
 * Return void
 */
export default function CheckerMySqlDatabaseConnectionService(dbConnection: any): void {
    dbConnection.connect((err: mySQL.MysqlError): void => {
        if (err) {
            LoggerComponent.logErrorMessage(err.message, "MysqlError connection");
            throw new ExceptionHandlerError(
                err.message,
                "MysqlError connection",
                HttpStatusCodesConstant.UNAUTHORIZED,
                true
            );
        }

        const data = {
            successMessage: Exception.dbConnexionSuccess,
            status: HttpStatusCodesConstant.OK
        };
        LoggerComponent.logSuccessMessage(JSON.stringify(data), "MySql connection");
        dbConnection.end((endConnectionErr: mySQL.MysqlError): void => {
            if (endConnectionErr) {
                LoggerComponent.logErrorMessage(endConnectionErr.message, "MysqlError")
                throw new ExceptionHandlerError(
                    endConnectionErr.message,
                    "MysqlError",
                    HttpStatusCodesConstant.UNAUTHORIZED,
                    true
                );
            }
            const data = {
                successMessage: Exception.dbConnexionClosed,
                status: HttpStatusCodesConstant.SERVICE_UNAVAILABLE
            }
            LoggerComponent.logSuccessMessage(data, "MySql connection");
        });
    });
}