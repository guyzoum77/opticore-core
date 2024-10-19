import {Exception as msg, LogMessageUtils, mySQL} from "../..";
import {mySqlErrorHandlerUtils} from "../../core/utils/mySqlErrorHandler.utils";


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
export default function CheckerMySqlDatabaseConnectionService(dbConnection: mySQL.Connection, user: string,
                                                              database: string, dbHost: string, password: string): void {
    dbConnection.connect((err: mySQL.MysqlError): void => {
        if (err) {
            return mySqlErrorHandlerUtils(err, dbHost, database, user, password);
        } else {
            LogMessageUtils.success("Database connection", "success connection", msg.dbConnexionSuccess);
            return dbConnection.end((endConErr: mySQL.MysqlError | undefined): void => {
                if (endConErr) {
                    return mySqlErrorHandlerUtils(err, dbHost, database, user, password);
                } else {
                    LogMessageUtils.success("Database connection", "End connection", msg.dbConnectionClosed);
                    console.log("");
                }
            });
        }
    });
}