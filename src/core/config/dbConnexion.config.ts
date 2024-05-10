import {
    CheckerMySqlDatabaseConnectionService, ExceptionHandlerError, HttpStatusCodesConstant, LoggerFormat, mySQL, stream,
    LoggerComponent, CustomTypesConfig
} from "../..";
import { AccessEnv } from "../../domain/env/access.env";
import { ServerEnvConfig } from "./serverEnv.config";
import CheckerMongoDatabaseConnectionService from "../../application/services/checkerMongoDatabaseConnection.service";
import CheckerPostgresDatabaseConnectionService
    from "../../application/services/checkerPostgresDatabaseConnection.service";
import {ConnectionOptions} from "tls";



/**
 * DbConnexionConfig is a class extending on the ServerEnvConfig class so that by inheritance,
 * certain methods make it possible to retrieve the variables values defined in
 * the .env environment file to establish the connection with the database service.
 */
export default class DbConnexionConfig extends ServerEnvConfig {
    private dbPort: string   = AccessEnv.dataBasePort();
    private user: string     = AccessEnv.user();
    private password: string = AccessEnv.password();
    private dbName: string   = AccessEnv.dataBaseName();
    private dbHost: string   = AccessEnv.dataBaseHost();

    public loggerFormat: LoggerFormat;

    /**
     *
     * @param logger
     */
    constructor(logger: LoggerFormat) {
        super();
        this.loggerFormat = logger;
    }


    /**
     * MySQL database connection with an optional arguments
     */
    public databaseMySQLConnexionConfig(optionalArgumentConnection: string | any) {
        const url: string = `mysql://${this.user}:${this.password}@${this.dbHost}:${this.dbPort}/${this.dbName}${optionalArgumentConnection}`;
        try {
            const dbConnection: mySQL.Connection = mySQL.createConnection(url);
            CheckerMySqlDatabaseConnectionService(dbConnection);
        } catch (err: any) {
            this.loggerFormat.logError(err.message, err);
            throw new ExceptionHandlerError(
                err.message,
                "MysqlError",
                err.code = "ER_ACCESS_DENIED_ERROR"
                    ? HttpStatusCodesConstant.UNAUTHORIZED
                    : HttpStatusCodesConstant.GONE,
                true
            );
        }
    }


    /**
     *
     * @param optionalArgumentConnection
     *
     * Mongo database connection with optional connection arguments
     */
    public async databaseMongoDBConnectionConfig(optionalArgumentConnection: any) {
        const url: string = `mongodb://${this.user}:${this.password}@${this.dbHost}:${this.dbPort}/${this.dbName}${optionalArgumentConnection}`;
        try {
            await CheckerMongoDatabaseConnectionService(url, this.user, this.password, this.dbName);
            LoggerComponent.logSuccessMessage("Connection successfully.", "Mongo connection");
        } catch (e: any) {
            if (e.code === 18) {
                this.loggerFormat.logError("Authentication failed, be sure the credentials is correct!", e.code);
                throw new ExceptionHandlerError(
                    "Authentication failed, be sure the credentials is correct!",
                    "MongoConnectionError",
                    HttpStatusCodesConstant.UNAUTHORIZED,
                    true
                );
            }
            if (e.cause.code === 'ERR_INVALID_URL') {
                this.loggerFormat.logError(`Unable to parse ${this.dbHost}:${this.dbPort} with URL`, e.code);
                throw new ExceptionHandlerError(
                    `Unable to parse ${this.dbHost}:${this.dbPort} with URL`,
                    "MongoConnectionError",
                    HttpStatusCodesConstant.BAD_REQUEST,
                    true
                );
            }
            if (e.code === undefined) {
                this.loggerFormat.logError(
                    `MongoServerSelectionError: getaddrinfo EAI_AGAIN (${this.dbHost} is not allow to database connection)`,
                    e.code
                );
                throw new ExceptionHandlerError(
                    `MongoServerSelectionError: getaddrinfo EAI_AGAIN (${this.dbHost} is not allow to database connection)`,
                    "MongoConnectionError",
                    HttpStatusCodesConstant.BAD_REQUEST,
                    true
                );
            }
            else {
                this.loggerFormat.logError(`${e.message}`, e.code);
                throw new ExceptionHandlerError(
                    `${e.message}`,
                    "MongoConnectionError",
                    HttpStatusCodesConstant.NOT_ACCEPTABLE,
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
    public async databasePostgresDBConnectionConfig(keepAlive?: boolean | undefined,
                                                    stream?: () => stream.Duplex | undefined, statement_timeout?: false | number | undefined,
                                                    ssl?: boolean | ConnectionOptions | undefined, query_timeout?: number | undefined,
                                                    keepAliveInitialDelayMillis?: number | undefined, idle_in_transaction_session_timeout?: number | undefined,
                                                    application_name?: string | undefined, connectionTimeoutMillis?: number | undefined,
                                                    types?: CustomTypesConfig | undefined, options?: string | undefined) {
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
            LoggerComponent.logSuccessMessage("Connection successfully.", "Postgres connection");
        } catch (err: any) {
            throw new ExceptionHandlerError(
                `${err.message}`,
                "PostgresConnectionError",
                HttpStatusCodesConstant.NOT_ACCEPTABLE,
                true
            );
        }
    }
}