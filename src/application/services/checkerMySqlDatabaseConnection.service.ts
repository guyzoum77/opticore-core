import {Exception as msg, LogMessageUtils} from "../..";
import {mySqlErrorHandlerUtils} from "../../core/utils/mySqlErrorHandler.utils";
import type {Connection, QueryError} from "mysql2";


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
export default function CheckerMySqlDatabaseConnectionService(dbConnection: Connection, user: string,
                                                              database: string, dbHost: string, password: string): void {
    dbConnection.connect((err: QueryError | null): void => {
        if (err) {
            return mySqlErrorHandlerUtils(err, dbHost, database, user, password);
        } else {
            LogMessageUtils.success("Database connection", "success connection", msg.dbConnexionSuccess);
            return dbConnection.end((endConErr: QueryError | null | undefined): void => {
                if (endConErr) {
                    return mySqlErrorHandlerUtils(endConErr, dbHost, database, user, password);
                } else {
                    LogMessageUtils.success("Database connection", "End connection", msg.dbConnectionClosed);
                    console.log("");
                }
            });
        }
    });
}