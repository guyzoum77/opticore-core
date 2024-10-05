import {
    CheckerMySqlDatabaseConnectionService,
    ExceptionHandlerError,
    HttpStatusCodesConstant as status,
    mySQL,
    stream,
    CustomTypesConfig,
    getEnvVariable,
    Exception as msg,
    LogMessageUtils as log, ExceptionHandlerError as ErrorHandler
} from "../..";
import CheckerMongoDatabaseConnectionService from "../../application/services/checkerMongoDatabaseConnection.service";
import CheckerPostgresDatabaseConnectionService from "../../application/services/checkerPostgresDatabaseConnection.service";
import {ConnectionOptions} from "tls";
import {DbConnexionConfigError} from "../../errors/dbConnexion.config.error";
import StackTraceError from "../handlers/errors/base/stackTraceError";
import {EnvironmentUtils as env} from "../utils/environment.utils";



/**
 * DbConnexionConfig is a class extending on the EnvConfig class so that by inheritance,
 * certain methods make it possible to retrieve the variables values defined in
 * the .env environment file to establish the connection with the database service.
 */
export class DbConnexionConfig {
    private env: env<any> = new env(getEnvVariable);

    /**
     * MySQL database connection with an optional arguments
     * Establish the connection between app and Database Management System.
     * Inside this class, a checker verify if database credentials is right,
     * and it's show off in log that the connection has been created successfully.
     * But if any error is occurring during trying connection, it's specify that error by stack traces.
     */
    public databaseMySQLConnexionChecker(optionalArgumentConnection: string | any): void {
        const dbURL: string = `${this.env.get("dataBaseUser")}:${this.env.get("dataBasePassword")}@${this.env.get("dataBaseHost")}:${this.env.get("dataBasePort")}/${this.env.get("dataBaseName")}`;
        const url: string = `mysql://${dbURL}${optionalArgumentConnection}`;
        const dbConnection: mySQL.Connection = mySQL.createConnection(url);
        return CheckerMySqlDatabaseConnectionService(dbConnection, this.env.get("dataBaseUser"), this.env.get("dataBaseName"), this.env.get("dataBaseHost"), this.env.get("dataBasePassword"));
    }


    /**
     *
     * @param optionalArgumentConnection
     *
     * Mongo database connection with optional connection arguments
     */
    public async databaseMongoDBConnectionChecker(optionalArgumentConnection: any): Promise<void> {
        const dbUrl: string = `${this.env.get("dataBaseUser")}:${this.env.get("dataBasePassword")}@${this.env.get("dataBaseHost")}:${this.env.get("dataBasePort")}/${this.env.get("dataBaseName")}`;
        const url: string = `mongodb://${dbUrl}${optionalArgumentConnection}`;
        try {
            await CheckerMongoDatabaseConnectionService(url, this.env.get("dataBaseUser"), this.env.get("dataBasePassword"), this.env.get("dataBaseName"));
            log.success(msg.MongoDBConnectionChecker, msg.MongoConnection, msg.mongoConnectionSuccess);
            console.log("");
        } catch (e: any) {
            if (e.code === 18) {
                DbConnexionConfigError.mongoDBAuthenticationFailed(e);
            }
            if (e.cause.code === 'ERR_INVALID_URL') {
                DbConnexionConfigError.mongoDBInvalidUrl(e, this.env.get("dataBaseHost"), this.env.get("dataBasePort"));
            }
            if (e.code === undefined) {
                DbConnexionConfigError.mongoDBEaiAgain(e, this.env.get("dataBaseHost"));
            } else {
                DbConnexionConfigError.mongoDbGlobalError(e);
            }
        }
    }


    /**
     *
     * @param keepAlive
     * @param stream
     * @param statement_timeout
     * @param ssl
     * @param query_timeout
     * @param keepAliveInitialDelayMillis
     * @param idle_in_transaction_session_timeout
     * @param application_name
     * @param connectionTimeoutMillis
     * @param types
     * @param options
     *
     * Postgres database connection with optional connection arguments
     */
    public async databasePostgresDBConnectionChecker(keepAlive?: boolean | undefined,
                                                    stream?: (() => (stream.Duplex | undefined)) | undefined,
                                                    statement_timeout?: false | number | undefined,
                                                    ssl?: boolean | ConnectionOptions | undefined,
                                                    query_timeout?: number | undefined,
                                                    keepAliveInitialDelayMillis?: number | undefined,
                                                    idle_in_transaction_session_timeout?: number | undefined,
                                                    application_name?: string | undefined,
                                                    connectionTimeoutMillis?: number | undefined,
                                                    types?: CustomTypesConfig | undefined,
                                                    options?: string | undefined): Promise<void> {
        const url: string = `postgresql:/${this.env.get("dataBaseUser")}:${this.env.get("dataBasePassword")}@${this.env.get("dataBaseHost")}:${this.env.get("dataBasePort")}/${this.env.get("dataBaseName")}`;
        try {
            await CheckerPostgresDatabaseConnectionService(
                url,
                keepAlive,
                stream,
                statement_timeout,
                ssl,
                query_timeout,
                keepAliveInitialDelayMillis,
                idle_in_transaction_session_timeout,
                application_name,
                connectionTimeoutMillis,
                types,
                options
            );
            log.success(msg.PostgresDBConnectionChecker, msg.PostgresConnection, msg.PostgresConnectionSuccess);
            console.log("");
        } catch (err: any) {
            throw new ExceptionHandlerError(
                `${err.message}`,
                "PostgresConnectionError",
                status.NOT_ACCEPTABLE,
                true
            );
        }
    }

    private traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}