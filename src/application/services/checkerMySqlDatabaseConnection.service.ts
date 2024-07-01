import {Exception, HttpStatusCodesConstant, LoggerComponent, mySQL } from "../..";
import {mySqlErrorHandlerUtils} from "../../core/utils/mySqlErrorHandler.utils";
import {MysqlError} from "mysql";


/**
 *
 * @param dbConnection
 * @param user
 * @param database
 * @param dbHost
 * @param password
 * @constructor
 *
 * Return void
 */
export default function CheckerMySqlDatabaseConnectionService(dbConnection: mySQL.Connection, user: string, database: string, dbHost: string,
                                                              password: string): void {
    dbConnection.connect((err: mySQL.MysqlError): void => {
        if (err) {
            return mySqlErrorHandlerUtils(err, dbHost, null, null, password);
        } else {
            const data: Object = {
                successMessage: Exception.dbConnexionSuccess,
                status: HttpStatusCodesConstant.OK
            };
            LoggerComponent.logInfoMessage(JSON.stringify(data), Exception.mysqlErrorCon);
            dbConnection.end((endConErr: mySQL.MysqlError | undefined): void => {
                if (endConErr) {
                    return mySqlErrorHandlerUtils(err, null, database, user, password);
                } else {
                    const closingData: Object = {
                        successMessage: Exception.dbConnexionClosed,
                        status: HttpStatusCodesConstant.SERVICE_UNAVAILABLE
                    }
                    LoggerComponent.logWarnMessage(JSON.stringify(closingData), Exception.mySqlCloseConnection);
                }
            });
        }
    });
}