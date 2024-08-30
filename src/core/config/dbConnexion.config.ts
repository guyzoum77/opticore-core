import {
    CheckerMySqlDatabaseConnectionService,
    ExceptionHandlerError,
    HttpStatusCodesConstant as status,
    mySQL,
    stream,
    LoggerComponent,
    CustomTypesConfig,
    getAccessEnv,
    LogMessageUtils
} from "../..";
import CheckerMongoDatabaseConnectionService from "../../application/services/checkerMongoDatabaseConnection.service";
import CheckerPostgresDatabaseConnectionService from "../../application/services/checkerPostgresDatabaseConnection.service";
import {ConnectionOptions} from "tls";



/**
 * DbConnexionConfig is a class extending on the ServerEnvConfig class so that by inheritance,
 * certain methods make it possible to retrieve the variables values defined in
 * the .env environment file to establish the connection with the database service.
 */
export class DbConnexionConfig {
    private dbPort: string   = getAccessEnv.dataBasePort;
    private user: string     = getAccessEnv.dataBaseUser;
    private password: string = getAccessEnv.dataBasePassword;
    private dbName: string   = getAccessEnv.dataBaseName;
    private dbHost: string   = getAccessEnv.dataBaseHost;


    /**
     * MySQL database connection with an optional arguments
     * Establish the connection between app and Database Management System.
     * Inside this class, a checker verify if database credentials is right,
     * and it's show off in log that the connection has been created successfully.
     * But if any error is occurring during trying connection, it's specify that error by stack traces.
     */
    public databaseMySQLConnexionChecker(optionalArgumentConnection: string | any): void {
        const dbURL: string = `${this.user}:${this.password}@${this.dbHost}:${this.dbPort}/${this.dbName}`;
        const url: string = `mysql://${dbURL}${optionalArgumentConnection}`;
        const dbConnection: mySQL.Connection = mySQL.createConnection(url);
        CheckerMySqlDatabaseConnectionService(dbConnection, this.user, this.dbName, this.dbHost, this.password);
    }


    /**
     *
     * @param optionalArgumentConnection
     *
     * Mongo database connection with optional connection arguments
     */
    public async databaseMongoDBConnectionChecker(optionalArgumentConnection: any): Promise<void> {
        const dbUrl: string = `${this.user}:${this.password}@${this.dbHost}:${this.dbPort}/${this.dbName}`;
        const url: string = `mongodb://${dbUrl}${optionalArgumentConnection}`;
        try {
            await CheckerMongoDatabaseConnectionService(url, this.user, this.password, this.dbName);
            LoggerComponent.logInfoMessage("Connection successfully.", "Mongo connection");
        } catch (e: any) {
            if (e.code === 18) {
                LogMessageUtils.error(
                    "MongoDB connection",
                    "authentication failed",
                    "failed",
                    e.code,
                    "bad credentials",
                    "Authentication failed, be sure the credentials is correct!",
                    status.UNAUTHORIZED
                );
                throw new ExceptionHandlerError(
                    "Authentication failed, be sure the credentials is correct!",
                    "MongoConnectionError",
                    status.UNAUTHORIZED,
                    true
                );
            }
            if (e.cause.code === 'ERR_INVALID_URL') {
                LogMessageUtils.error(
                    "MongoDB connection",
                    "unable to parse",
                    "url",
                    e.code,
                    "parse url",
                    `Unable to parse ${this.dbHost}:${this.dbPort} with URL`,
                    status.BAD_REQUEST
                );
                throw new ExceptionHandlerError(
                    `Unable to parse ${this.dbHost}:${this.dbPort} with URL`,
                    "MongoConnectionError",
                    status.BAD_REQUEST,
                    true
                );
            }
            if (e.code === undefined) {
                LogMessageUtils.error(
                    "MongoDB connection",
                    "MongoServer selection error",
                    "MongoServer",
                    e.code,
                    "undefined",
                    `MongoServerSelectionError: getaddrinfo EAI_AGAIN (${this.dbHost} is not allow to database connection)`,
                    status.BAD_REQUEST
                );
                throw new ExceptionHandlerError(
                    `MongoServerSelectionError: getaddrinfo EAI_AGAIN (${this.dbHost} is not allow to database connection)`,
                    "MongoConnectionError",
                    status.BAD_REQUEST,
                    true
                );
            } else {
                LogMessageUtils.error(
                    "MongoDB connection",
                    "MongoConnection error",
                    "",
                    e.code,
                    "",
                    e.message,
                    status.NOT_ACCEPTABLE
                );
                throw new ExceptionHandlerError(
                    `${e.message}`,
                    "MongoConnectionError",
                    status.NOT_ACCEPTABLE,
                    true
                );
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
        const url: string = `postgresql:/${this.user}:${this.password}@${this.dbHost}:${this.dbPort}/${this.dbName}`;
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
            LoggerComponent.logInfoMessage("Connection successfully.", "Postgres connection");
        } catch (err: any) {
            throw new ExceptionHandlerError(
                `${err.message}`,
                "PostgresConnectionError",
                status.NOT_ACCEPTABLE,
                true
            );
        }
    }
}