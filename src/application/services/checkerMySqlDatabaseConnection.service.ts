import {Exception, HttpStatusCodesConstant, LoggerComponent, mySQL } from "../..";
import {mySqlErrorHandlerUtils} from "../../core/utils/mySqlErrorHandler.utils";


/**
 *
 * @param dbConnection
 * @param user
 * @param database
 * @param dbHost
 * @constructor
 *
 * Return void
 */
export default function CheckerMySqlDatabaseConnectionService(dbConnection: any, user: string, database: string, dbHost: string): void {
    dbConnection.connect((err: mySQL.MysqlError): void => {
        if (err) {
            mySqlErrorHandlerUtils(err, dbHost);
        }

        const data = {
            successMessage: Exception.dbConnexionSuccess,
            status: HttpStatusCodesConstant.OK
        };
        LoggerComponent.logSuccessMessage(JSON.stringify(data), Exception.mysqlErrorCon);
        dbConnection.end((endConErr: mySQL.MysqlError): void => {
            if (endConErr) {
                mySqlErrorHandlerUtils(err, null, database, user);
            }
            const data = {
                successMessage: Exception.dbConnexionClosed,
                status: HttpStatusCodesConstant.SERVICE_UNAVAILABLE
            }
            LoggerComponent.logSuccessMessage(data, Exception.mySqlCloseConnection);
        });
    });
}